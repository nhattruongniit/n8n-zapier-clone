import { realtime, staticSchema } from "inngest";
import { GEMINI_CHANNEL_NAME, HttpRequestStatus } from "@/config/constants";

export const geminiChannel = realtime.channel({
  name: ({ contentId }: { contentId: string }) => `${GEMINI_CHANNEL_NAME}:${contentId}`,
  topics: {
    nodeId: {
      schema: staticSchema<{ nodeId: string }>(),
    },
    status: {
      schema: staticSchema<{ status: HttpRequestStatus }>(),
    }
  },
});