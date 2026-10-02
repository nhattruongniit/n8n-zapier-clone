"use client";

import React from "react";
import { useReactFlow, type Node, type NodeProps } from "@xyflow/react";
import { FALLBACK_MODEL_GEMINI } from "@/config/constants";
import { BaseExecutionNode } from "@/features/executions/components/base-execution-node";
import { GeminiDialog, GeminiFormValues } from "./dialog";
import { useNodeStatus } from "../../hooks/use-node-status";
import { getGeminiRealtimeToken } from "./actions";
import { geminiChannel } from "@/inngest/channels/gemini";

type GeminiNodeData = {
  variableName?: string;
  model?: string;
  systemPrompt?: string;
  userPrompt?: string;
}

type GeminiNodeType = Node<GeminiNodeData>;

export const GeminiNode = (props: NodeProps<GeminiNodeType>) => {
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const { setNodes } = useReactFlow();

  const nodeStatus = useNodeStatus({
    nodeId: props.id,
    channel: geminiChannel({ contentId: props.id }).name,
    topic: "status",
    refreshToken: () => getGeminiRealtimeToken(props.id),
  });

  const nodeData = props.data;
  const description = nodeData?.userPrompt
      ? `${nodeData.model || FALLBACK_MODEL_GEMINI} : ${nodeData.userPrompt.slice(0, 50)}...`
      : "Not configured";

  function handleOpenSettings() {
    setDialogOpen(true);
  }

  function handleSubmit(values: GeminiFormValues) {
    setNodes(nodes => nodes.map(node => {
      if (node.id === props.id) {
        return {
          ...node,
          data: {
            ...node.data,
            ...values,
          }
        }
      }
      return node;
    }));
  };

  return (
    <>
      <GeminiDialog 
        isOpen={dialogOpen} 
        onOpenChange={setDialogOpen} 
        onSubmit={handleSubmit}
        defaultValues={nodeData}
      />
      <BaseExecutionNode 
        {...props}
        id={props.id}
        icon="/logo/gemini.svg"
        name="Gemini"
        status={nodeStatus}
        description={description}
        onSettings={handleOpenSettings}
        onDoubleClick={handleOpenSettings}
      />
    </>
  )
}; 