"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { FlaskConicalIcon } from "lucide-react";
import { useExecuteWorkflow } from "@/features/workflows/hooks/use-workflows";

interface ExecuteWorkflowButtonProps {
  workflowId: string;
}

export const ExecuteWorkflowButton = React.memo(({ workflowId }: ExecuteWorkflowButtonProps) => {
  const executeWorkflow = useExecuteWorkflow();

  function handleExecute() {
    executeWorkflow.mutate({ 
      id: workflowId
    })
  }

  return (
    <Button size="lg" onClick={handleExecute} disabled={executeWorkflow.isPending}>
      <FlaskConicalIcon className="w-4 h-4" />
      <span>Execute Workflow</span>
    </Button>
  );
});

ExecuteWorkflowButton.displayName = "ExecuteWorkflowButton";