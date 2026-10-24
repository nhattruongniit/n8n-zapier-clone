import type { NodeExecutor } from "@/features/executions/types";
import { manualTriggerChannel } from "@/inngest/channels/manual-trigger";

type ManualTriggerData = Record<string, unknown>;

export const manualTriggerExecutor: NodeExecutor<ManualTriggerData> = async ({
  nodeId,
  context,
  step,
}) => {
  const ch = manualTriggerChannel({ contentId: nodeId });
  
  await step.realtime.publish(`publish:${nodeId}:loading`, ch.status, {
    status: "loading",
  });

  try {
    const result = await step.run("manual-trigger", async () => context);

    await step.realtime.publish(`publish:${nodeId}:success`, ch.status, {
      status: "success",
    });

    return result;
  } catch (error) {
    await step.realtime.publish(`publish:${nodeId}:error`, ch.status, {
      status: "error",
    });
    throw error;
  }
};