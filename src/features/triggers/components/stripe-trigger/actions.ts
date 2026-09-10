"use server";

import { getClientSubscriptionToken, type ClientSubscriptionToken } from "inngest/react";
import { inngest } from "@/inngest/client";
import { stripeTriggerChannel } from "@/inngest/channels/stripe-trigger";

export async function getStripeTriggerRealtimeToken(nodeId: string): Promise<ClientSubscriptionToken> {
  return getClientSubscriptionToken(inngest, {
    channel: stripeTriggerChannel({ contentId: nodeId }),
    topics: ["status"],
  });
}
