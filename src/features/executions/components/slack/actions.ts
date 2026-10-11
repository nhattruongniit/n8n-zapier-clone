"use server";

import { getClientSubscriptionToken, type ClientSubscriptionToken } from "inngest/react";
import { inngest } from "@/inngest/client";
import { slackChannel } from "@/inngest/channels/slack";

export async function getSlackRealtimeToken(nodeId: string): Promise<ClientSubscriptionToken> {
  return getClientSubscriptionToken(inngest, {
    channel: slackChannel({ contentId: nodeId }),
    topics: ["status"],
  });
}
