import { inngest } from "./client";
import { createId } from "@paralleldrive/cuid2"

export async function sendWorkflowExecution(data: {
  workflowId: string;
  [key: string]: unknown;
}) {
  return inngest.send({
    name: "workflows/execute.workflow",
    data,
    id: createId()
  });
}