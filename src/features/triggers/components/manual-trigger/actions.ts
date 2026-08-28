"use server";

import { getClientSubscriptionToken, type ClientSubscriptionToken } from "inngest/react";
import { inngest } from "@/inngest/client";
import { manualTriggerChannel } from "@/inngest/channels/manual-trigger";

export async function getManualTriggerRealtimeToken(nodeId: string): Promise<ClientSubscriptionToken> {
  return getClientSubscriptionToken(inngest, {
    channel: manualTriggerChannel({ contentId: nodeId }),
    topics: ["status"],
  });
}
