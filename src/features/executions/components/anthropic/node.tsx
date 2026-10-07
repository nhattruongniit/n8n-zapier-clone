"use client";

import React from "react";
import { useReactFlow, type Node, type NodeProps } from "@xyflow/react";
import { FALLBACK_MODEL_ANTHROPIC } from "@/config/constants";
import { BaseExecutionNode } from "@/features/executions/components/base-execution-node";
import { AnthropicDialog, AnthropicFormValues } from "./dialog";
import { useNodeStatus } from "../../hooks/use-node-status";
import { getAnthropicRealtimeToken } from "./actions";
import { anthropicChannel } from "@/inngest/channels/anthropic";

type AnthropicNodeData = {
  variableName?: string;
  credentialId?: string;
  model?: string;
  systemPrompt?: string;
  userPrompt?: string;
}

type Anthropic = Node<AnthropicNodeData>;

export const AnthropicNode = (props: NodeProps<Anthropic>) => {
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const { setNodes } = useReactFlow();

  const nodeStatus = useNodeStatus({
    nodeId: props.id,
    channel: anthropicChannel({ contentId: props.id }).name,
    topic: "status",
    refreshToken: () => getAnthropicRealtimeToken(props.id),
  });

  const nodeData = props.data;
  const description = nodeData?.userPrompt
      ? `${nodeData.model || FALLBACK_MODEL_ANTHROPIC}: ${nodeData.userPrompt.slice(0, 50)}...`
      : "Not configured";

  function handleOpenSettings() {
    setDialogOpen(true);
  }

  function handleSubmit(values: AnthropicFormValues) {
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
      <AnthropicDialog 
        isOpen={dialogOpen} 
        onOpenChange={setDialogOpen} 
        onSubmit={handleSubmit}
        defaultValues={nodeData}
      />
      <BaseExecutionNode 
        {...props}
        id={props.id}
        icon="/logo/anthropic.svg"
        name="Anthropic"
        status={nodeStatus}
        description={description}
        onSettings={handleOpenSettings}
        onDoubleClick={handleOpenSettings}
      />
    </>
  )
}; 