"use client";

import React from "react";
import { useReactFlow, type Node, type NodeProps } from "@xyflow/react";
import { FALLBACK_MODEL_GEMINI } from "@/config/constants";
import { BaseExecutionNode } from "@/features/executions/components/base-execution-node";
import { SlackDialog, SlackFormValues } from "./dialog";
import { useNodeStatus } from "../../hooks/use-node-status";
import { getSlackRealtimeToken } from "./actions";
import { slackChannel } from "@/inngest/channels/slack";

type SlackNodeData = {
  webhookUrl?: string;
  content?: string;
  username?: string;
}

type SlackNodeType = Node<SlackNodeData>;

export const SlackNode = (props: NodeProps<SlackNodeType>) => {
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const { setNodes } = useReactFlow();

  const nodeStatus = useNodeStatus({
    nodeId: props.id,
    channel: slackChannel({ contentId: props.id }).name,
    topic: "status",
    refreshToken: () => getSlackRealtimeToken(props.id),
  });

  const nodeData = props.data;
  const description = nodeData?.content
      ? `Send message: ${nodeData.content.slice(0, 50)}...`
      : "Not configured";

  function handleOpenSettings() {
    setDialogOpen(true);
  }

  function handleSubmit(values: SlackFormValues) {
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
      <SlackDialog 
        isOpen={dialogOpen} 
        onOpenChange={setDialogOpen} 
        onSubmit={handleSubmit}
        defaultValues={nodeData}
      />
      <BaseExecutionNode 
        {...props}
        id={props.id}
        icon="/logo/slack.svg"
        name="Slack"
        status={nodeStatus}
        description={description}
        onSettings={handleOpenSettings}
        onDoubleClick={handleOpenSettings}
      />
    </>
  )
}; 