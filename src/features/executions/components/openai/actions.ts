"use server";

import { getClientSubscriptionToken, type ClientSubscriptionToken } from "inngest/react";
import { inngest } from "@/inngest/client";
import { openAiChannel } from "@/inngest/channels/openai";

export async function getOpenAiRealtimeToken(nodeId: string): Promise<ClientSubscriptionToken> {
  return getClientSubscriptionToken(inngest, {
    channel: openAiChannel({ contentId: nodeId }),
    topics: ["status"],
  });
}
