"use client";

import React from "react";
import type { NodeProps } from "@xyflow/react";
import { MousePointerIcon } from "lucide-react";

import { BaseTriggerNode } from "@/features/triggers/components/base-trigger-node";
import { useNodeStatus } from "@/features/executions/hooks/use-node-status";
import { manualTriggerChannel } from "@/inngest/channels/manual-trigger";

import { getManualTriggerRealtimeToken } from "./actions";
import { ManualTriggerDialog } from "./dialog";

export const ManualTriggerNode = React.memo((props: NodeProps) => {
  const [dialogOpen, setDialogOpen] = React.useState(false);
  
   const nodeStatus = useNodeStatus({
    nodeId: props.id,
    channel: manualTriggerChannel({ contentId: props.id }).name,
    topic: "status",
    refreshToken: () => getManualTriggerRealtimeToken(props.id),
  });
  

  function handleOpenSettings() {
    setDialogOpen(true);
  }

  return (
    <>
      <ManualTriggerDialog isOpen={dialogOpen} onOpenChange={setDialogOpen} />

      <BaseTriggerNode
        {...props}
        icon={MousePointerIcon}
        name="When clicking 'Execute workflow'"
        status={nodeStatus}
        // description={description}
        onSettings={handleOpenSettings}
        onDoubleClick={handleOpenSettings}
      />
    </>
  )
});

ManualTriggerNode.displayName = "ManualTriggerNode";