"use client";

import React from "react";
import { useReactFlow, type Node, type NodeProps } from "@xyflow/react";
import { FALLBACK_MODEL_OPENAI } from "@/config/constants";
import { BaseExecutionNode } from "@/features/executions/components/base-execution-node";
import { OpenAiDialog, OpenAiFormValues } from "./dialog";
import { useNodeStatus } from "../../hooks/use-node-status";
import { getOpenAiRealtimeToken } from "./actions";
import { openAiChannel } from "@/inngest/channels/openai";

type OpenAiNodeData = {
  variableName?: string;
  model?: string;
  systemPrompt?: string;
  userPrompt?: string;
}

type OpenAiNodeType = Node<OpenAiNodeData>;

export const OpenAiNode = (props: NodeProps<OpenAiNodeType>) => {
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const { setNodes } = useReactFlow();

  const nodeStatus = useNodeStatus({
    nodeId: props.id,
    channel: openAiChannel({ contentId: props.id }).name,
    topic: "status",
    refreshToken: () => getOpenAiRealtimeToken(props.id),
  });

  const nodeData = props.data;
  const description = nodeData?.userPrompt
      ? `${nodeData.model || FALLBACK_MODEL_OPENAI}: ${nodeData.userPrompt.slice(0, 50)}...`
      : "Not configured";

  function handleOpenSettings() {
    setDialogOpen(true);
  }

  function handleSubmit(values: OpenAiFormValues) {
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
      <OpenAiDialog 
        isOpen={dialogOpen} 
        onOpenChange={setDialogOpen} 
        onSubmit={handleSubmit}
        defaultValues={nodeData}
      />
      <BaseExecutionNode 
        {...props}
        id={props.id}
        icon="/logo/openai.svg"
        name="OpenAI"
        status={nodeStatus}
        description={description}
        onSettings={handleOpenSettings}
        onDoubleClick={handleOpenSettings}
      />
    </>
  )
}; 