"use client";

import React from "react";
import { useReactFlow, type Node, type NodeProps } from "@xyflow/react";
import { FALLBACK_MODEL_GEMINI } from "@/config/constants";
import { BaseExecutionNode } from "@/features/executions/components/base-execution-node";
import { DiscordDialog, DiscordFormValues } from "./dialog";
import { useNodeStatus } from "../../hooks/use-node-status";
import { getDiscordRealtimeToken } from "./actions";
import { discordChannel } from "@/inngest/channels/discord";

type DiscordNodeData = {
  webhookUrl?: string;
  content?: string;
  username?: string;
}

type DiscordNodeType = Node<DiscordNodeData>;

export const DiscordNode = (props: NodeProps<DiscordNodeType>) => {
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const { setNodes } = useReactFlow();

  const nodeStatus = useNodeStatus({
    nodeId: props.id,
    channel: discordChannel({ contentId: props.id }).name,
    topic: "status",
    refreshToken: () => getDiscordRealtimeToken(props.id),
  });

  const nodeData = props.data;
  const description = nodeData?.content
      ? `Send message: ${nodeData.content.slice(0, 50)}...`
      : "Not configured";

  function handleOpenSettings() {
    setDialogOpen(true);
  }

  function handleSubmit(values: DiscordFormValues) {
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
      <DiscordDialog 
        isOpen={dialogOpen} 
        onOpenChange={setDialogOpen} 
        onSubmit={handleSubmit}
        defaultValues={nodeData}
      />
      <BaseExecutionNode 
        {...props}
        id={props.id}
        icon="/logo/discord.svg"
        name="Discord"
        status={nodeStatus}
        description={description}
        onSettings={handleOpenSettings}
        onDoubleClick={handleOpenSettings}
      />
    </>
  )
}; 