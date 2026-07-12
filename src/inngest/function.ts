// src/inngest/functions.ts
import prisma from "@/lib/db";
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { generateText } from 'ai';

import { inngest } from "./client";

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY || "",
});

export const processTask = inngest.createFunction(
  { 
    id: "process-task", 
    triggers: { 
      event: "app/task.created" 
    }
  },
  async ({ step }) => {
    await step.sleep("fetching", "3s");
    await step.sleep("transcript", "3s");
    await step.sleep("sending-to-ai", "3s");

    await step.run('create-workflow', () => {
      return prisma.workflow.create({
        data: {
          name: 'workflow-from-inngest-' + Math.floor(Math.random() * 1000).toString()
        }
      })
    })
  }
);

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