import Handlebars from "handlebars";
import { createAnthropic } from "@ai-sdk/anthropic";
import type { NodeExecutor } from "@/features/executions/types";
import { NonRetriableError } from "inngest";
import { anthropicChannel } from "@/inngest/channels/anthropic";
import { generateText } from "ai";
import { FALLBACK_MODEL_ANTHROPIC } from "@/config/constants";

Handlebars.registerHelper('json', context => {
  try {
    const stringified = JSON.stringify(context, null, 2);
    return new Handlebars.SafeString(stringified);  
  } catch (error) {
    throw new Error(`Failed to stringify JSON in Handlebars helper: ${error}`);
  }
});

type AnthropicData = {
  variableName?: string;
  model?: string;
  systemPrompt?: string;
  userPrompt?: string;
}

export const anthropicExecutor: NodeExecutor<AnthropicData> = async ({
  data,
  nodeId,
  context,
  step,
}) => {
  const ch = anthropicChannel({ contentId: nodeId });
  await step.realtime.publish("publish:anthropic-execution", ch.status, {
    status: "loading",
  });

  if (!data.variableName && typeof data.variableName === 'string') {
    await step.realtime.publish("publish:anthropic-execution", ch.status, { status: "error" });
    throw new NonRetriableError("Anthropic node: No variable name configured");
  }

  if (!data.userPrompt) {
    await step.realtime.publish("publish:anthropic-execution", ch.status, { status: "error" });
    throw new NonRetriableError("Anthropic node: No user prompt configured");
  }

  const systemPrompt = data.systemPrompt
    ? Handlebars.compile(data.systemPrompt)(context)
    : "You are a helpful assistant.";
  
  const userPrompt = data.userPrompt
    ? Handlebars.compile(data.userPrompt)(context)
    : "";

  const anthropic = createAnthropic({
    apiKey: process.env.ANTHROPIC_API_KEY!,
  });

  try {
    await step.realtime.publish("publish:anthropic-execution", ch.status, { status: "loading" });

    const { steps } = await step.ai.wrap("anthropic-generate-text", generateText, {
      model: anthropic(data.model ?? FALLBACK_MODEL_ANTHROPIC),
      system: systemPrompt,
      prompt: userPrompt,
      telemetry: {
        isEnabled: true,
        recordInputs: true,
        recordOutputs: true,
      }
    });

    await step.realtime.publish("publish:anthropic-execution", ch.status, { status: "success" });

    const text = steps[0].content[0].type === "text" ? steps[0].content[0].text : "";

    return {
      ...context,
      [data.variableName!]: {
        text
      }
    }
  } catch (error) {
    await step.realtime.publish("publish:anthropic-execution", ch.status, { status: "error" });
    throw error;
  }
}