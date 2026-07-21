// import { TRPCError } from "@trpc/server";
import { inngest } from "@/inngest/client";
import prisma from "@/lib/db";
import { baseProcedure, createTRPCRouter, protectedProcedure, premiumProcedure } from "../init";
import { workflowsRouter } from "@/features/workflows/server/routers";

export const appRouter = createTRPCRouter({
  // get list of users  with authentication
  getUsers: protectedProcedure.query(({ ctx }) => {
    return prisma.user.findMany({
      where: {
        id: ctx.auth.user.id,
      },
    });
  }),
  // getUsers: baseProcedure
  //   .query(() => {
  //     return prisma.user.findMany();
  // }),
  getWorkflows: protectedProcedure.query(() => {
    return prisma.workflow.findMany();
  }),
  createWorkflow: protectedProcedure.mutation(async () => {
    await inngest.send({
      name: "app/task.created",
      data: {
        id: `task_${Math.floor(Math.random() * 1000).toString()}`,
      },
    });
    return { success: true, message: "Workflow creation triggered" };
  }),
  testAi: baseProcedure.mutation(async () => {
    // throw new TRPCError({
    //   code: "BAD_REQUEST",
    //   message: "This is a test error for demonstration purposes.",
    // });
    await inngest.send({
      name: "app/task.ai",
      data: {
        id: `task_${Math.floor(Math.random() * 1000).toString()}`,
      },
    });
    return { success: true, message: "AI test triggered" };
  }),
  testAiPremium: premiumProcedure.mutation(async () => {
    // throw new TRPCError({
    //   code: "BAD_REQUEST",
    //   message: "This is a test error for demonstration purposes.",
    // });
    await inngest.send({
      name: "app/task.ai",
      data: {
        id: `task_${Math.floor(Math.random() * 1000).toString()}`,
      },
    });
    return { success: true, message: "AI test triggered" };
  }),
  workflows: workflowsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
