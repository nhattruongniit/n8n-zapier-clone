
"use client";
import { useEffect, useRef, useState } from "react";
import { useUpdateWorkflowName } from "@/features/workflows/hooks/use-workflows";
import Link from "next/link";

import { SaveIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Input } from "@/components/ui/input";
import { useSuspenseWorkflow } from "@/features/workflows/hooks/use-workflows";

export const EditorSaveButton = ({ workflowId }: { workflowId: string }) => {
  return (
    <div className="ml-auto">
      <Button 
        size="sm"
        disabled={false}
        onClick={() => {}}
      >
        <SaveIcon className="size-4" />
        Save
      </Button>
    </div>
  )
}

export const EditorNameInput = ({ workflowId }: { workflowId: string }) => {
  const { data: workflow } = useSuspenseWorkflow(workflowId);
  const updateWorkflow = useUpdateWorkflowName();
  const [name, setName] = useState(workflow.name);
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (workflow.name) {
      setName(workflow.name);
    }
  },[workflow.name])

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing])

  async function handleSave() {
    if (name === workflow.name) {
      setIsEditing(false);
      return;
    }
    try {
      await updateWorkflow.mutateAsync({ id: workflowId, name });
    } catch {
      setName(workflow.name);
    } finally {
      setIsEditing(false);
    }
  }
  
  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setName(workflow.name);
      setIsEditing(false);
    }
  }

  if (isEditing) {
    return (
      <Input 
        disabled={updateWorkflow.isPending}
        ref={inputRef}
        value={name}
        onChange={e => setName(e.target.value)}
        onBlur={handleSave}
        onKeyDown={handleKeyDown}
        className="h-7 w-auto min-w-[100px] px-2"
      />
    )
  }

  return (
    <BreadcrumbItem className="cursor-pointer hover:text-foreground transition-colors" onClick={() => setIsEditing(true)}>
      {workflow.name}
    </BreadcrumbItem>
  )
} 

export const EditorBreadcrumbs = ({ workflowId }: { workflowId: string }) => {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink render={<Link prefetch href="/workflows">Workflows</Link>} />
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <EditorNameInput workflowId={workflowId} />
      </BreadcrumbList>
    </Breadcrumb>
  )
}

export const EditorHeader = ({ workflowId }: { workflowId: string }) => {
  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4 bg-background">
      <SidebarTrigger />
      <div className="flex flex-row items-center justify-between gap-x-4 w-full">
        <EditorBreadcrumbs workflowId={workflowId} />
        <EditorSaveButton workflowId={workflowId} />
      </div>
    </header>
  )
}