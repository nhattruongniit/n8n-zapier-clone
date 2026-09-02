"use client";

import React from "react";
import type { NodeProps } from "@xyflow/react";

import { BaseTriggerNode } from "@/features/triggers/components/base-trigger-node";
import { useNodeStatus } from "@/features/executions/hooks/use-node-status";
import { googleFormTriggerChannel } from "@/inngest/channels/google-form-trigger";

import { getGoogleFormTriggerRealtimeToken } from "./actions";
import { GoogleFormTriggerDialog } from "./dialog";

export const GoogleFormTrigger = React.memo((props: NodeProps) => {
  const [dialogOpen, setDialogOpen] = React.useState(false);
  
  const nodeStatus = useNodeStatus({
    nodeId: props.id,
    channel: googleFormTriggerChannel({ contentId: props.id }).name,
    topic: "status",
    refreshToken: () => getGoogleFormTriggerRealtimeToken(props.id),
  });

  function handleOpenSettings() {
    setDialogOpen(true);
  }

  return (
    <>
      <GoogleFormTriggerDialog isOpen={dialogOpen} onOpenChange={setDialogOpen} />

      <BaseTriggerNode
        {...props}
        icon="/logo/googleform.svg"
        name="Google Form"
        description="When form is submitted"
        status={nodeStatus}
        onSettings={handleOpenSettings}
        onDoubleClick={handleOpenSettings}
      />
    </>
  )
});

GoogleFormTrigger.displayName = "GoogleFormTrigger";