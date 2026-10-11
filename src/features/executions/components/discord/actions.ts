"use server";

import { getClientSubscriptionToken, type ClientSubscriptionToken } from "inngest/react";
import { inngest } from "@/inngest/client";
import { discordChannel } from "@/inngest/channels/discord";

export async function getDiscordRealtimeToken(nodeId: string): Promise<ClientSubscriptionToken> {
  return getClientSubscriptionToken(inngest, {
    channel: discordChannel({ contentId: nodeId }),
    topics: ["status"],
  });
}
