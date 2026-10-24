import type { NodeExecutor } from "@/features/executions/types";
import { stripeTriggerChannel } from "@/inngest/channels/stripe-trigger";

type StripeTriggerData = Record<string, unknown>;

export const stripeTriggerExecutor: NodeExecutor<StripeTriggerData> = async ({
  nodeId,
  context,
  step,
}) => {
  const ch = stripeTriggerChannel({ contentId: nodeId });
  
  await step.realtime.publish(`publish:${nodeId}:loading`, ch.status, {
    status: "loading",
  });

  try {
    const result = await step.run("stripe-trigger", async () => context);

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