"use client";

import { useReactFlow, type Node, type NodeProps } from "@xyflow/react";
import { GlobeIcon } from "lucide-react";
import React from "react";
import { BaseExecutionNode } from "@/features/executions/components/base-execution-node";
import { HttpRequestDialog } from "./dialog";

type HttpRequestNodeData = {
  endPoint?: string;
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: string;
  [key: string]: unknown;
}

type HttpRequestNodeType = Node<HttpRequestNodeData>;

interface SubmitValues {
  endpoint: string;
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: string;
}

export const HttpRequestNode = React.memo((props: NodeProps<HttpRequestNodeType>) => {
 const [dialogOpen, setDialogOpen] = React.useState(false);
 const { setNodes } = useReactFlow();

  const nodeStatus = "initial";
  const nodeData = props.data;
  const description = React.useMemo(
    () => nodeData?.endPoint
      ? `${nodeData.method || "GET"} : ${nodeData.endPoint}`
      : "Not configured",
    [nodeData?.endPoint, nodeData?.method]
  );

  const handleOpenSettings = React.useCallback(() => {
    setDialogOpen(true);
  }, []);

  const handleSubmit = React.useCallback((values: SubmitValues) => {
    const { endpoint, method, body } = values;

    setNodes(nodes => nodes.map(node => {
      if (node.id === props.id) {
        return {
          ...node,
          data: {
            ...node.data,
            endPoint: endpoint,
            method: method,
            body: body,
          }
        }
      }
      return node;
    }))
  }, [props.id, setNodes]);

  return (
    <>
      <HttpRequestDialog 
        isOpen={dialogOpen} 
        onOpenChange={setDialogOpen} 
        onSubmit={handleSubmit}
        defaultEndpoint={nodeData.endPoint}
        defaultMethod={nodeData.method}
        defaultBody={nodeData.body}
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
});

HttpRequestNode.displayName = "HttpRequestNode";