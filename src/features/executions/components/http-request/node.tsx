"use client";

import React from "react";
import { useReactFlow, type Node, type NodeProps } from "@xyflow/react";
import { GlobeIcon } from "lucide-react";
import { BaseExecutionNode } from "@/features/executions/components/base-execution-node";
import { HttpRequestDialog, HttpRequestFormValues } from "./dialog";
import { useNodeStatus } from "../../hooks/use-node-status";
import { getHttpRequestRealtimeToken } from "./actions";
import { httpRequestChannel } from "@/inngest/channels/http-request";

type HttpRequestNodeData = {
  variableName?: string;
  endpoint?: string;
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: string;
}

type HttpRequestNodeType = Node<HttpRequestNodeData>;

export const HttpRequestNode = (props: NodeProps<HttpRequestNodeType>) => {
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const { setNodes } = useReactFlow();

  const nodeStatus = useNodeStatus({
    nodeId: props.id,
    channel: httpRequestChannel({ contentId: props.id }).name,
    topic: "status",
    refreshToken: () => getHttpRequestRealtimeToken(props.id),
  });

  const nodeData = props.data;
  const description = nodeData?.endpoint
      ? `${nodeData.method || "GET"} : ${nodeData.endpoint}`
      : "Not configured";

  function handleOpenSettings() {
    setDialogOpen(true);
  }

  function handleSubmit(values: HttpRequestFormValues) {
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
      <HttpRequestDialog 
        isOpen={dialogOpen} 
        onOpenChange={setDialogOpen} 
        onSubmit={handleSubmit}
        defaultValues={nodeData}
      />
      <BaseExecutionNode 
        {...props}
        id={props.id}
        icon={GlobeIcon}
        name="HTTP Request"
        status={nodeStatus}
        description={description}
        onSettings={handleOpenSettings}
        onDoubleClick={handleOpenSettings}
      />
    </>
  )
}; 