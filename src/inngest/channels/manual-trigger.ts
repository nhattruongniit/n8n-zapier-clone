import { realtime, staticSchema } from "inngest";
import { HttpRequestStatus, MANUAL_TRIGGER_CHANNEL_NAME } from "@/config/constants";

export const manualTriggerChannel = realtime.channel({
  name: ({ contentId }: { contentId: string }) => `${MANUAL_TRIGGER_CHANNEL_NAME}:${contentId}`,
  topics: {
    nodeId: {
      schema: staticSchema<{ nodeId: string }>(),
    },
    status: {
      schema: staticSchema<{ status: HttpRequestStatus }>(),
    }
  },
});