import { realtime, staticSchema } from "inngest";
import { DISCORD_CHANNEL_NAME, HttpRequestStatus } from "@/config/constants";

export const slackChannel = realtime.channel({
  name: ({ contentId }: { contentId: string }) => `${DISCORD_CHANNEL_NAME}:${contentId}`,
  topics: {
    nodeId: {
      schema: staticSchema<{ nodeId: string }>(),
    },
    status: {
      schema: staticSchema<{ status: HttpRequestStatus }>(),
    }
  },
});