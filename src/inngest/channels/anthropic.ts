import { realtime, staticSchema } from "inngest";
import { HttpRequestStatus, ANTHROPIC_CHANNEL_NAME } from "@/config/constants";

export const anthropicChannel = realtime.channel({
  name: ({ contentId }: { contentId: string }) => `${ANTHROPIC_CHANNEL_NAME}:${contentId}`,
  topics: {
    nodeId: {
      schema: staticSchema<{ nodeId: string }>(),
    },
    status: {
      schema: staticSchema<{ status: HttpRequestStatus }>(),
    }
  },
});