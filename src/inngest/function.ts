// src/inngest/functions.ts
import prisma from "@/lib/db";
import { inngest } from "./client";

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