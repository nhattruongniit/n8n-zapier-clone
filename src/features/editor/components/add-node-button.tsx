"use client";

import { PlusIcon } from "lucide-react";
import React from "react";
import { Button } from "@/components/ui/button";
import { NodeSelector } from "@/components/node-selector";

export const AddNodeButton = React.memo(() => {
  const [selectorOpen, setSelectorOpen] = React.useState(false);
  
  return (
    <NodeSelector
      open={selectorOpen}
      onOpenChange={setSelectorOpen}
    >
      <Button
        onClick={() => setSelectorOpen(true)}
        size="icon"
        variant="outline"
        className="bg-background"
      >
        <PlusIcon className="size-4" />
      </Button>
    </NodeSelector>
  );
});

AddNodeButton.displayName = "AddNodeButton";