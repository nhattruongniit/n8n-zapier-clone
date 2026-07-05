import { 
  // baseProcedure, 
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
});

// export type definition of API
export type AppRouter = typeof appRouter;