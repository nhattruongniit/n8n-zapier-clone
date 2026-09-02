import { realtime, staticSchema } from "inngest";
import { HttpRequestStatus, GOOGLE_FORM_TRIGGER_CHANNEL_NAME } from "@/config/constants";

export const googleFormTriggerChannel = realtime.channel({
  name: ({ contentId }: { contentId: string }) => `${GOOGLE_FORM_TRIGGER_CHANNEL_NAME}:${contentId}`,
  topics: {
    nodeId: {
      schema: staticSchema<{ nodeId: string }>(),
    },
    status: {
      schema: staticSchema<{ status: HttpRequestStatus }>(),
    }
  },
});