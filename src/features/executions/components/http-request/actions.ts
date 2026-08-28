"use server";

import { getClientSubscriptionToken, type ClientSubscriptionToken } from "inngest/react";
import { inngest } from "@/inngest/client";
import { httpRequestChannel } from "@/inngest/channels/http-request";

export async function getHttpRequestRealtimeToken(nodeId: string): Promise<ClientSubscriptionToken> {
  return getClientSubscriptionToken(inngest, {
    channel: httpRequestChannel({ contentId: nodeId }),
    topics: ["status"],
  });
}
