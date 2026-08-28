import type { NodeExecutor } from "@/features/executions/types";
import { manualTriggerChannel } from "@/inngest/channels/manual-trigger";

type ManualTriggerData = Record<string, unknown>;

export const manualTriggerExecutor: NodeExecutor<ManualTriggerData> = async ({
  nodeId,
  context,
  step,
}) => {
  const ch = manualTriggerChannel({ contentId: nodeId });
  
  await step.realtime.publish("publish:manual-trigger", ch.status, {
    status: "loading",
  });

  const result = await step.run("manual-trigger", async () => context);
 
  await step.realtime.publish("publish:manual-trigger", ch.status, {
    status: "success",
  });

  return result;
}