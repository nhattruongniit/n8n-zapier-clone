// src/inngest/functions.ts
import prisma from "@/lib/db";
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { generateText } from 'ai';
import { NonRetriableError } from "inngest";

import { inngest } from "./client";
import { topologicalSort } from "@/utils/toposort-node";
import { getExecutor } from "@/features/executions/lib/executor-registry";
import { ExecutionStatus } from "@/generated/prisma";

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
  async ({ step }) => {
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
      event: "workflows/execute.workflow",
    },
    retries: process.env.NODE_ENV === 'production' ? 3 : 0,
    onFailure: async ({ event }) => {
      return prisma.execution.update({
        where: { inngestEventId: event.data.event.id },
        data: {
          status: ExecutionStatus.FAILED,
          error: event.data.error.message,
          errorStack: event.data.error.stack
        }
      })
    }
  },
  async ({ event, step }) => {
    const inngestEventId = event.id;
    const workflowId = event.data.workflowId;

    if (!inngestEventId || !workflowId) {
      throw new NonRetriableError("Event ID or workflow ID is missing");
    }

    await step.run("create-execution", async () => {
      return prisma.execution.create({
        data: {
          workflowId,
          inngestEventId
        }
      })
    })
  
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

    const userId = await step.run("find-user-id", async () => {
      const workflow = await prisma.workflow.findUniqueOrThrow({
        where: { id: workflowId },
        select: {
          userId: true
        }
      });
      return workflow.userId
    })

    let context = event.data.initialData || {};
    for (const node of sortedNodes) {
      const executor = getExecutor(node.type);
      context = await executor({
        data: node.data as Record<string, unknown>,
        nodeId: node.id,
        userId,
        context,
        step
      });
    }

    await step.run("update-execution", async () => {
      return prisma.execution.update({
        where: { inngestEventId, workflowId },
        data: {
          status: ExecutionStatus.SUCCESS,
          complatedAt: new Date(),
          output: context,
        }
      })
    })

    return { 
      workflowId,
      result: context 
    };
  }
);