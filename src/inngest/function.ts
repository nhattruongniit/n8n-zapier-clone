// src/inngest/functions.ts
import prisma from "@/lib/db";
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { generateText } from 'ai';
import { NonRetriableError } from "inngest";
import { NodeType } from "@/generated/prisma";

import { inngest } from "./client";
import { topologicalSort } from "@/utils/toposort-node";
import { getExecutor } from "@/features/executions/lib/executor-registry";

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY || "",
});

export const processAi = inngest.createFunction(
  { 
    id: "process-ai", 
    triggers: { 
      event: "app/task.ai" 
    }
  },
  async ({ event, step }) => {
    await step.sleep('pretend', '5s');
    
    const { steps } = await step.ai.wrap("gemini-generate-text", generateText, {
      model: google('gemini-2.5-flash'),
      system: "You are a helpful assistant that generates text based on the input provided.",
      prompt: "What is 2 + 2?",
      experimental_telemetry: {
        isEnabled: true,
        functionId: "joke_agent",
        recordInputs: true,
        recordOutputs: true,
      },
    });

    return steps;
  }
);

export const executeWorkflow = inngest.createFunction(
  { 
    id: "execute-workflow" ,
    triggers: {
      event: "workflows/execute.workflow"
    }
  },
  async ({ event, step }) => {
    const workflowId = event.data.workflowId;

    if(!workflowId) {
      throw new NonRetriableError("Workflow ID is required to execute the workflow.");
    }

    const sortedNodes = await step.run("prepare-workflow", async () => {
      const workflow = await prisma.workflow.findUniqueOrThrow({
        where: { id: workflowId },
        include: {
          nodes: true,
          connections: true,
        }
      });
     return topologicalSort(workflow.nodes, workflow.connections);
    });

    let context = event.data.initialData || {};
    for (const node of sortedNodes) {
      const executor = getExecutor(node.type);
      context = await executor({
        data: node.data as Record<string, unknown>,
        nodeId: node.id,
        context,
        step,
      });
    }

    return { 
      workflowId,
      result: context 
    };
  }
);