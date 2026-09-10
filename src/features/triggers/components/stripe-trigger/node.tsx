"use client";

import React from "react";
import type { NodeProps } from "@xyflow/react";

import { BaseTriggerNode } from "@/features/triggers/components/base-trigger-node";
import { useNodeStatus } from "@/features/executions/hooks/use-node-status";
import { stripeTriggerChannel } from "@/inngest/channels/stripe-trigger";

import { getStripeTriggerRealtimeToken } from "./actions";
import { StripeTriggerDialog } from "./dialog";

export const StripeTriggerNode = React.memo((props: NodeProps) => {
  const [dialogOpen, setDialogOpen] = React.useState(false);
  
  const nodeStatus = useNodeStatus({
    nodeId: props.id,
    channel: stripeTriggerChannel({ contentId: props.id }).name,
    topic: "status",
    refreshToken: () => getStripeTriggerRealtimeToken(props.id),
  });

  function handleOpenSettings() {
    setDialogOpen(true);
  }

  return (
    <>
      <StripeTriggerDialog isOpen={dialogOpen} onOpenChange={setDialogOpen} />

      <BaseTriggerNode
        {...props}
        icon="/logo/stripe.svg"
        name="Stripe"
        description="When a Stripe event occurs"
        status={nodeStatus}
        onSettings={handleOpenSettings}
        onDoubleClick={handleOpenSettings}
      />
    </>
  )
});

StripeTriggerNode.displayName = "StripeTriggerNode";