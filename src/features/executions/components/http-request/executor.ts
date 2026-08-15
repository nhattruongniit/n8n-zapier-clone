import { MethodType } from "@/config/constants";
import { NonRetriableError } from "inngest";
import ky, { type Options as KyOptions } from "ky";

import type { NodeExecutor } from "@/features/executions/types";

type httpRequestData = {
  endpoint?: string;
  method?: MethodType;
  body?: string;
}

export const httpRequestExecutor: NodeExecutor<httpRequestData> = async ({
  data,
  nodeId, 
  context, 
  step 
}) => {
  // publish "loading" state 
  if (!data.endpoint) {
    throw new NonRetriableError("HTTP Request node: No endpoint configure");
  }
  const result = await step.run("http-request", async () => {
    const endpoint = data.endpoint!;
    const method = data.method || 'GET';
    const options: KyOptions = { method };

    if (['POST', 'PUT', 'PATCH'].includes(method)) {
      options.body = data.body;
    }

    const response = await ky(endpoint, options);
    const contentType = response.headers.get('content-type');
    const responseData = contentType?.includes("application/json") ? await response.json() : await response.text();

    return {
      ...context,
      httpResponse: {
        status: response.status,
        statusText: response.statusText,
        data: responseData
      }
    }
  })

  // publish "success" state

  return result;
}