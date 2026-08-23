import { MethodType } from "@/config/constants";
import { NonRetriableError } from "inngest";
import ky, { type Options as KyOptions } from "ky";

import type { NodeExecutor } from "@/features/executions/types";

type httpRequestData = {
  variableName?: string;
  endpoint?: string;
  method?: MethodType;
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

  const result = await step.run("http-request", async () => {
    const endpoint = data.endpoint!;
    const method = data.method || 'GET';
    const options: KyOptions = { method };

    if (['POST', 'PUT', 'PATCH'].includes(method)) {
      options.body = data.body;
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

    if (data.variableName) {
      return {
        ...context,
      [data.variableName]: payload
      }
    }

    // fallback
    return {
      ...context,
      ...payload,
    }
    
  })

  // publish "success" state

  return result;
}