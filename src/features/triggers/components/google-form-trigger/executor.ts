import type { NodeExecutor } from "@/features/executions/types";
import { googleFormTriggerChannel } from "@/inngest/channels/google-form-trigger";

type GoogleFormTriggerData = Record<string, unknown>;

export const googleFormTriggerExecutor: NodeExecutor<GoogleFormTriggerData> = async ({
  nodeId,
  context,
  step,
}) => {
  const ch = googleFormTriggerChannel({ contentId: nodeId });
  
  await step.realtime.publish(`publish:${nodeId}:loading`, ch.status, {
    status: "loading",
  });

  try {
    const result = await step.run("google-form-trigger", async () => context);

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