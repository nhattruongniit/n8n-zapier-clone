import Handlebars from "handlebars";
import { MethodType } from "@/config/constants";
import { NonRetriableError } from "inngest";
import ky, { type Options as KyOptions } from "ky";

import type { NodeExecutor } from "@/features/executions/types";

Handlebars.registerHelper('json', context => {
  const stringified = JSON.stringify(context, null, 2);
  return new Handlebars.SafeString(stringified);
});

type httpRequestData = {
  variableName: string;
  endpoint: string;
  method: MethodType;
  body?: string;
}

export const httpRequestExecutor: NodeExecutor<httpRequestData> = async ({
  data,
  context, 
  step 
}) => {
  if (!data.variableName && typeof data.variableName === 'string') {
    throw new NonRetriableError("HTTP Request node: No variable name configured");
  }

  if (!data.endpoint) {
    throw new NonRetriableError("HTTP Request node: No endpoint configured");
  }

  if (!data.method) {
    throw new NonRetriableError("HTTP Request node: No method configured");
  }

  const result = await step.run("http-request", async () => {
    const endpoint = Handlebars.compile(data.endpoint)(context);
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

  return result;
}