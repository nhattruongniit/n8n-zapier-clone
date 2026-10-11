import { realtime, staticSchema } from "inngest";
import { SLACK_CHANNEL_NAME, HttpRequestStatus } from "@/config/constants";

export const discordChannel = realtime.channel({
  name: ({ contentId }: { contentId: string }) => `${SLACK_CHANNEL_NAME}:${contentId}`,
  topics: {
    nodeId: {
      schema: staticSchema<{ nodeId: string }>(),
    },
    status: {
      schema: staticSchema<{ status: HttpRequestStatus }>(),
    }
  },
});