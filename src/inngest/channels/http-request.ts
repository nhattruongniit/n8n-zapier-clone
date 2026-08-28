import { realtime, staticSchema } from "inngest";
import { HTTP_REQUEST_CHANNEL_NAME, HttpRequestStatus } from "@/config/constants";

export const httpRequestChannel = realtime.channel({
  name: ({ contentId }: { contentId: string }) => `${HTTP_REQUEST_CHANNEL_NAME}:${contentId}`,
  topics: {
    nodeId: {
      schema: staticSchema<{ nodeId: string }>(),
    },
    status: {
      schema: staticSchema<{ status: HttpRequestStatus }>(),
    }
  },
});