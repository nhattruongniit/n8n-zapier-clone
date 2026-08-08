"use client";

import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useReactFlow } from '@xyflow/react';
import {
  GlobeIcon,
  MousePointerIcon,
} from 'lucide-react';
import { 
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger, 
} from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { NodeType } from '@/generated/prisma';
import { toast } from 'sonner';

export type NodeTypeOption = {
  type: NodeType;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }> | string;
}

const triggerNodes: NodeTypeOption[] = [
  {
    type: NodeType.MANUAL_TRIGGER,
    label: 'Trigger Manually',
    description: 'Runs the flow on clicking a button. Good for getting started quickly.',
    icon: MousePointerIcon,
  }
]

const excutionNodes: NodeTypeOption[] = [
  {
    type: NodeType.HTTP_REQUEST,
    label: 'HTTP Request',
    description: 'Make an HTTP request.',
    icon: GlobeIcon,
  }
]

interface NodeSelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

export const NodeSelector = ({ open, onOpenChange, children }: NodeSelectorProps) => {
  const { setNodes, getNodes, screenToFlowPosition } = useReactFlow();

  const handleNodeSelect = (selection: NodeTypeOption) => {
    if (selection.type === NodeType.MANUAL_TRIGGER) {
      const nodes = getNodes();
      const hasManualTrigger = nodes.some((node) => node.type === NodeType.MANUAL_TRIGGER);
      if (hasManualTrigger) {
        toast.error("Only one manual trigger node is allowed in a workflow.");
        return;
      }
    }

    setNodes((nodes) => {
      const hasInitialTrigger = nodes.some((node) => node.type === NodeType.INITIAL);
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      const flowPosition = screenToFlowPosition({ 
        x: centerX + (Math.random() - 0.5) * 200,  
        y: centerY + (Math.random() - 0.5) * 200,
      });
      const newNode = {
        id: uuidv4(),
        data: {},
        position: flowPosition,
        type: selection.type,
      }

      if (hasInitialTrigger) {
        const initial = nodes.find((node) => node.type === NodeType.INITIAL);
        const replacement = {
          id: initial?.id || newNode.id,
          data: newNode.data,
          position: initial?.position || newNode.position,
          type: newNode.type,
        }
        return nodes.map((node) => node.id === initial?.id ? replacement : node);
      }
      return [...nodes, newNode];
    });

    onOpenChange(false);
  }
  
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger render={<>{children}</>} />
      <SheetContent className="w-full sm:max-w-md overflow-auto">
        <SheetHeader>
          <SheetTitle>What triggers this workflow?</SheetTitle>
          <SheetDescription>
            A trigger is a step that starts yout workflow.
          </SheetDescription>
        </SheetHeader>
        <div>
          {triggerNodes.map((node) => {
            const Icon = node.icon;
            return (
              <div
                key={node.type}
                className="w-full justify-start h-auto py-5 px-4 rounded-none cursor-pointer border-l-2 border-transparent hover:border-l-primary"
                onClick={() => handleNodeSelect(node)}
              >
                <div className="flex items-center gap-6 w-full overflow-hidden">
                  {typeof Icon === 'string' ? (
                    <img 
                      src={Icon}
                      alt={node.label}
                      className="size-5 object-contain rounded-sm"
                    />
                  ) : (
                    <Icon className="size-5"/>
                  )}
                  <div className="flex flex-col items-start text-left">
                    <span className="font-medium text-sm">{node.label}</span>
                    <span className="text-xs">{node.description}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
        <Separator className="h-px" />
        <div>
          {excutionNodes.map((node) => {
            const Icon = node.icon;
            return (
              <div
                key={node.type}
                className="w-full justify-start h-auto py-5 px-4 rounded-none cursor-pointer border-l-2 border-transparent hover:border-l-primary"
                onClick={() => handleNodeSelect(node)}
              >
                <div className="flex items-center gap-6 w-full overflow-hidden">
                  {typeof Icon === 'string' ? (
                    <img 
                      src={Icon}
                      alt={node.label}
                      className="size-5 object-contain rounded-sm"
                    />
                  ) : (
                    <Icon className="size-5"/>
                  )}
                  <div className="flex flex-col items-start text-left">
                    <span className="font-medium text-sm">{node.label}</span>
                    <span className="text-xs">{node.description}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </SheetContent>
    </Sheet>
  )
}