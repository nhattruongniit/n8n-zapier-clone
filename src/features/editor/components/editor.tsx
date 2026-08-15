"use client";
import { useCallback, useState, useMemo } from 'react';
import { useSetAtom } from 'jotai';
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
import { ExecuteWorkflowButton } from './execute-workflow-button';

//@ts-ignore
import '@xyflow/react/dist/style.css';
import { AddNodeButton } from './add-node-button';
import { editorAtom } from '../store/atoms';
import { NodeType } from '@/generated/prisma';

export const Editor = ({ workflowId }: { workflowId: string }) => {
  const { data: workflow } = useSuspenseWorkflow(workflowId);
  const setEditor = useSetAtom(editorAtom)

  const [nodes, setNodes] = useState<Node[]>(workflow.nodes);
  const [edges, setEdges] = useState<Edge[]>(workflow.edges);
 
  const onNodesChange = useCallback((changes: NodeChange[]) => setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)), []);
  const onEdgesChange = useCallback((changes: EdgeChange[]) => setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)), []);
  const onConnect = useCallback((params: Connection) => setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)), []);

  const hasManualTrigger = useMemo(() => {
    return nodes.some(node => node.type === NodeType.MANUAL_TRIGGER);
  }, [nodes])
 
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
          onInit={setEditor}
          fitView
          snapGrid={[10, 10]}
          snapToGrid
          panOnScroll
          selectNodesOnDrag
        >
            <Background />
            <MiniMap /> 
            <Controls />
            <Panel position="top-right">
              <AddNodeButton />
            </Panel>
            {hasManualTrigger && (
              <Panel position="bottom-center">
                <ExecuteWorkflowButton workflowId={workflowId} />
              </Panel>
            )}
        </ReactFlow>
      </div>
    </>
  )
}