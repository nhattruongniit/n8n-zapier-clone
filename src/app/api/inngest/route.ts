import { serve } from "inngest/next";
import { inngest } from "@/inngest/client";
import { processAi, executeWorkflow } from "@/inngest/function";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    processAi,
    executeWorkflow,
  ],
});