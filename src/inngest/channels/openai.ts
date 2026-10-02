import { realtime, staticSchema } from "inngest";
import { OPENAI_CHANNEL_NAME, HttpRequestStatus } from "@/config/constants";

export const openAiChannel = realtime.channel({
  name: ({ contentId }: { contentId: string }) => `${OPENAI_CHANNEL_NAME}:${contentId}`,
  topics: {
    nodeId: {
      schema: staticSchema<{ nodeId: string }>(),
    },
    status: {
      schema: staticSchema<{ status: HttpRequestStatus }>(),
    }
  },
});