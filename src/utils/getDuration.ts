import { Execution } from "@/generated/prisma";

export const getDuration = (data: Execution) => data.complatedAt ? Math.round(new Date(data.complatedAt).getTime() - new Date(data.startedAt).getTime()) / 1000 : null;