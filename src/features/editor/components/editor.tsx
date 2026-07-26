"use client";
import { useCallback, useState } from 'react';
import { nodeComponents } from '@/config/node-components';
import { 
  ReactFlow, 
  applyNodeChanges, 
  applyEdgeChanges, 
  addEdge, 
  Background,
  MiniMap,
  Controls,
  Panel,
  type EdgeChange, 
  type Connection, 
  type Node,
  type Edge,
  type NodeChange,
} from '@xyflow/react';
import { useSuspenseWorkflow } from "@/features/workflows/hooks/use-workflows";

//@ts-ignore
import '@xyflow/react/dist/style.css';
import { AddNodeButton } from './add-node-button';

export const Editor = ({ workflowId }: { workflowId: string }) => {
  const { data: workflow } = useSuspenseWorkflow(workflowId);

  const [nodes, setNodes] = useState<Node[]>(workflow.nodes);
  const [edges, setEdges] = useState<Edge[]>(workflow.edges);
 
  const onNodesChange = useCallback((changes: NodeChange[]) => setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)), []);
  const onEdgesChange = useCallback((changes: EdgeChange[]) => setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)), []);
  const onConnect = useCallback((params: Connection) => setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)), []);
 
  return (
    <>
      <div className="size-full">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeComponents}
          fitView
        >
            <Background />
            <MiniMap /> 
            <Controls />
            <Panel position="top-right">
              <AddNodeButton />
            </Panel>
        </ReactFlow>
      </div>
    </>
  )
}