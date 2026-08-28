import Handlebars from "handlebars";
import { MethodType } from "@/config/constants";
import { NonRetriableError } from "inngest";
import ky, { type Options as KyOptions } from "ky";

import type { NodeExecutor } from "@/features/executions/types";
import { httpRequestChannel } from "@/inngest/channels/http-request";

Handlebars.registerHelper('json', context => {
  try {
    const stringified = JSON.stringify(context, null, 2);
    return new Handlebars.SafeString(stringified);  
  } catch (error) {
    throw new Error(`Failed to stringify JSON in Handlebars helper: ${error}`);
  }
});

type httpRequestData = {
  variableName: string;
  endpoint: string;
  method: MethodType;
  body?: string;
}

export const httpRequestExecutor: NodeExecutor<httpRequestData> = async ({
  data,
  nodeId,
  context,
  step,
}) => {
  const ch = httpRequestChannel({ contentId: nodeId });
  await step.realtime.publish("publish:http-request", ch.status, {
    status: "loading",
  });

  if (!data.variableName && typeof data.variableName === 'string') {
    await step.realtime.publish("publish:http-request", ch.status, { status: "error" });
    throw new NonRetriableError("HTTP Request node: No variable name configured");
  }

  if (!data.endpoint) {
    await step.realtime.publish("publish:http-request", ch.status, { status: "error" });
    throw new NonRetriableError("HTTP Request node: No endpoint configured");
  }

  if (!data.method) {
    await step.realtime.publish("publish:http-request", ch.status, { status: "error" });
    throw new NonRetriableError("HTTP Request node: No method configured");
  }

  let result: Record<string, unknown>;
  try {
    result = await step.run("http-request", async () => {
      let endpoint: string;
      try {
        const template = Handlebars.compile(data.endpoint);
        endpoint = template(context);
        if (!endpoint || typeof endpoint !== 'string') {
          throw new Error(`Endpoint template must resolve to a non-empty string. Got: ${endpoint}`);
        }
      } catch (error) {
        throw new NonRetriableError(`Failed to compile endpoint template: ${error}`);
      }
      const method = data.method;
      const options: KyOptions = { method };

      if (['POST', 'PUT', 'PATCH'].includes(method)) {
        const resolved = Handlebars.compile(data.body || "{}")(context);
        JSON.parse(resolved); // validate JSON
        options.body = resolved;
        options.headers = {
          "Content-Type": "application/json"
        }
      }

      const response = await ky(endpoint, options);
      const contentType = response.headers.get('content-type');
      const responseData = contentType?.includes("application/json") ? await response.json() : await response.text();

      const payload = {
        httpResponse: {
          status: response.status,
          statusText: response.statusText,
          data: responseData
        }
      }

      const compliedVariableName = Handlebars.compile(data.variableName)(context);
      return {
        ...context,
        [compliedVariableName]: payload
      }
    })

    await step.realtime.publish("publish:http-request", ch.status, { status: "success" });
    return result;
  } catch (error) {
    await step.realtime.publish("publish:http-request", ch.status, { status: "error" });
    throw error;
  }
}