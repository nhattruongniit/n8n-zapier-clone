import { inngest } from '@/inngest/client';
import { 
  baseProcedure, 
  createTRPCRouter, 
  protectedProcedure 
} from '../init';
import prisma from '@/lib/db';
 
export const appRouter = createTRPCRouter({
  // get list of users  with authentication
  getUsers: protectedProcedure
    .query(({ ctx }) => {
      return prisma.user.findMany({
        where: {
          id: ctx.auth.user.id
        }
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
        id: "task_" + Math.floor(Math.random() * 1000).toString(),
      }
    })
    return { success: true, message: "Workflow creation triggered" };
  }),
  testAi: baseProcedure.mutation(async () => {
    await inngest.send({
      name: "app/task.ai",
      data: {
        id: "task_" + Math.floor(Math.random() * 1000).toString(),
      } 
    })
    return { success: true, message: "AI test triggered" };
  })
});

// export type definition of API
export type AppRouter = typeof appRouter;