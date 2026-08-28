import React from 'react';
import { useRealtime, type ClientSubscriptionToken } from 'inngest/react';
import type { NodeStatus } from "@/components/react-flow/node-status-indicator";

interface UseNodeStatusOptionProps {
  nodeId: string;
  channel: string;
  topic: string;
  refreshToken: () => Promise<ClientSubscriptionToken>;
}

export function useNodeStatus({ nodeId: _nodeId, channel, topic, refreshToken }: UseNodeStatusOptionProps) {
  const [status, setStatus] = React.useState<NodeStatus>("initial");

  const topics = React.useMemo(() => [topic] as const, [topic]);

  const { messages } = useRealtime({
    channel,
    topics,
    token: refreshToken,
    autoCloseOnTerminal: false,
  });

  React.useEffect(() => {
    const latest = messages.byTopic[topic];
    if (!latest) return;
    const data = latest.data as { status?: NodeStatus };
    if (data?.status) {
      setStatus(data.status);
    }
  }, [messages.byTopic, topic]);

  return status;
}