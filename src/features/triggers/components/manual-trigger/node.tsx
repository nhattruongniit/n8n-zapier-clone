"use client";

import type { NodeProps } from "@xyflow/react";
import { MousePointerIcon } from "lucide-react";
import React from "react";
import { BaseTriggerNode } from "@/features/triggers/components/base-trigger-node";
import { ManualTriggerDialog } from "./dialog";

export const ManualTriggerNode = React.memo((props: NodeProps) => {
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const nodeStatus = "initial";

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