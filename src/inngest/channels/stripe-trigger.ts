import { realtime, staticSchema } from "inngest";
import { HttpRequestStatus, STRIPE_TRIGGER_CHANNEL_NAME } from "@/config/constants";

export const stripeTriggerChannel = realtime.channel({
  name: ({ contentId }: { contentId: string }) => `${STRIPE_TRIGGER_CHANNEL_NAME}:${contentId}`,
  topics: {
    nodeId: {
      schema: staticSchema<{ nodeId: string }>(),
    },
    status: {
      schema: staticSchema<{ status: HttpRequestStatus }>(),
    }
  },
});