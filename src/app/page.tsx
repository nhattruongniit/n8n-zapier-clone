"use client";

// import { caller } from "@/trpc/server";
// import { requireAuth } from "@/lib/auth-utils";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { LogoutButton } from "./logout";
import { Button } from "@/components/ui/button";

const Page = () => {
  /* use server-side fetching with trpc with authentication
    await requireAuth();
    const data = await caller.getUsers();
  */

  const trpc = useTRPC();
  // const queryClient = useQueryClient();
  const { data } = useQuery(trpc.getWorkflows.queryOptions());
  const create = useMutation(trpc.createWorkflow.mutationOptions({
    onSuccess: () => {
      // queryClient.invalidateQueries(trpc.getWorkflows.queryOptions()); // query again to get the latest data
      toast.success("Workflow creation triggered");
    }
  }));
  
  return (
    <div className="min-h-screen min-w-screen flex flex-col items-center justify-center">
      protected server component
      <div>
        {JSON.stringify(data, null, 2)}
      </div>
      <br /><br />
      <Button 
        disabled={create.isPending}
        onClick={() => create.mutate()}
      >
        Create workflow
      </Button>
      <br /><br />
      <LogoutButton />
    </div>
  )
}

export default Page;