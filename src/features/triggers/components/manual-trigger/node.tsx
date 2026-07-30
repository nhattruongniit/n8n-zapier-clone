"use client";

import type { NodeProps } from "@xyflow/react";
import { MousePointerIcon } from "lucide-react";
import React from "react";
import { BaseTriggerNode } from "@/features/triggers/components/base-trigger-node";

export const ManualTriggerNode = React.memo((props: NodeProps) => {
  return (
    <>
      <BaseTriggerNode
        {...props}
        icon={MousePointerIcon}
        name="When clicking 'Execute workflow'"
        // description={description}
        // onSettings={() => {}}
        // onDoubleClick={() => {}}
      />
    </>
  )
});

ManualTriggerNode.displayName = "ManualTriggerNode";