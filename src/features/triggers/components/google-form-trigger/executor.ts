import type { NodeExecutor } from "@/features/executions/types";
import { googleFormTriggerChannel } from "@/inngest/channels/google-form-trigger";

type GoogleFormTriggerData = Record<string, unknown>;

export const googleFormTriggerExecutor: NodeExecutor<GoogleFormTriggerData> = async ({
  nodeId,
  context,
  step,
}) => {
  const ch = googleFormTriggerChannel({ contentId: nodeId });
  
  await step.realtime.publish("publish:google-form-trigger", ch.status, {
    status: "loading",
  });

  const result = await step.run("google-form-trigger", async () => context);
 
  await step.realtime.publish("publish:google-form-trigger", ch.status, {
    status: "success",
  });

  return result;
}