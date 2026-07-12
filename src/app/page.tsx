"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
// import { caller } from "@/trpc/server";
// import { requireAuth } from "@/lib/auth-utils";
import { useTRPC } from "@/trpc/client";
import { LogoutButton } from "./logout";

const Page = () => {
  /* use server-side fetching with trpc with authentication
    await requireAuth();
    const data = await caller.getUsers();
  */

  const trpc = useTRPC();
  // const queryClient = useQueryClient();
  const { data } = useQuery(trpc.getWorkflows.queryOptions());
  const create = useMutation(
    trpc.createWorkflow.mutationOptions({
      onSuccess: () => {
        // queryClient.invalidateQueries(trpc.getWorkflows.queryOptions()); // query again to get the latest data
        toast.success("Workflow creation triggered");
      },
    }),
  );
  const testAi = useMutation(
    trpc.testAi.mutationOptions({
      onSuccess: () => {
        toast.success("AI creation triggered");
      },
      onError: () => {
        toast.error("AI creation failed");
      },
    }),
  );

  return (
    <div className="min-h-screen min-w-screen flex flex-col items-center justify-center">
      protected server component
      <div>{JSON.stringify(data, null, 2)}</div>
      <br />
      <br />
      <Button disabled={testAi.isPending} onClick={() => testAi.mutate()}>
        Test AI
      </Button>
      <br />
      <br />
      <Button disabled={create.isPending} onClick={() => create.mutate()}>
        Create workflow
      </Button>
      <br />
      <br />
      <LogoutButton />
    </div>
  );
};

export default Page;
