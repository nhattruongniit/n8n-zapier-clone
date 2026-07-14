"use client";

import { Button } from "@/components/ui/button";
import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

const Page = () => {
  const trpc = useTRPC();
  const testAIPremium = useMutation(trpc.testAiPremium.mutationOptions({
    onSuccess: () => {
      toast.success("AI test triggered successfully");
    },
    onError: (error) => {
      toast.error(`Error triggering AI test: ${error.message}`);
    }
  }));

  return (
    <Button onClick={() => testAIPremium.mutate()}>
      Click me to test AI Premium
    </Button>
  )
}

export default Page;