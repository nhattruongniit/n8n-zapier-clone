import Handlebars from "handlebars";
import { decode } from "html-entities";
import type { NodeExecutor } from "@/features/executions/types";
import { NonRetriableError } from "inngest";
import { discordChannel } from "@/inngest/channels/discord";
import ky from "ky";

Handlebars.registerHelper('json', context => {
  try {
    const stringified = JSON.stringify(context, null, 2);
    return new Handlebars.SafeString(stringified);  
  } catch (error) {
    throw new Error(`Failed to stringify JSON in Handlebars helper: ${error}`);
  }
});

type DiscordData = {
  variableName?: string;
  webhookUrl?: string;
  content?: string;
  username?: string;
}

export const discordExecutor: NodeExecutor<DiscordData> = async ({
  data,
  nodeId,
  context,
  step,
}) => {
  const ch = discordChannel({ contentId: nodeId });
  await step.realtime.publish(`publish:${nodeId}:loading`, ch.status, {
    status: "loading",
  });

  try {
    if (!data.content) {
      throw new NonRetriableError("Discord node: Message content not configured");
    }

    const rawContent = Handlebars.compile(data.content)(context);
    const content = decode(rawContent);
    const username = data.username ? decode(Handlebars.compile(data.username)(context)) : undefined;

    const result = await step.run("discord-webhook", async () => {
      if (!data.webhookUrl) {
        await step.realtime.publish(`publish:${nodeId}:error`, ch.status, { status: "error" });
        throw new NonRetriableError("Discord node: Webhook URL not configured");
      }      
      await ky.post(data.webhookUrl, {
        json: {
          content: content.slice(0, 2000), 
          username
        }
      })

      if (!data.variableName) {
        await step.realtime.publish(`publish:${nodeId}:error`, ch.status, { status: "error" });
        throw new NonRetriableError("Discord node: No variable name configured");
      }
      
      return {
        ...context,
        [data.variableName]: {
          messageContent: content.slice(0, 2000),
        }
      }
    })
    await step.realtime.publish(`publish:${nodeId}:success`, ch.status, {
      status: "success",
    });
    return result;
  } catch (error) {
    await step.realtime.publish(`publish:${nodeId}:error`, ch.status, { status: "error" });
    throw error;
  }
}