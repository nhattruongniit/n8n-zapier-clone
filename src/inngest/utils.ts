import { inngest } from "./client";

export async function sendWorkflowExecution(data: {
  workflowId: string;
  [key: string]: unknown;
}) {
  return inngest.send({
    name: "workflows/execute.workflow",
    data,
  });
}