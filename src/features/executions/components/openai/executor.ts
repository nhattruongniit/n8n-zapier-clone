import Handlebars from "handlebars";
import { createOpenAI } from "@ai-sdk/openai";
import type { NodeExecutor } from "@/features/executions/types";
import { NonRetriableError } from "inngest";
import { openAiChannel } from "@/inngest/channels/openai";
import { generateText } from "ai";
import { FALLBACK_MODEL_OPENAI } from "@/config/constants";

Handlebars.registerHelper('json', context => {
  try {
    const stringified = JSON.stringify(context, null, 2);
    return new Handlebars.SafeString(stringified);  
  } catch (error) {
    throw new Error(`Failed to stringify JSON in Handlebars helper: ${error}`);
  }
});

type OpenAiData = {
  variableName?: string;
  model?: string;
  systemPrompt?: string;
  userPrompt?: string;
}

export const openAiExecutor: NodeExecutor<OpenAiData> = async ({
  data,
  nodeId,
  context,
  step,
}) => {
  const ch = openAiChannel({ contentId: nodeId });
  await step.realtime.publish("publish:openai-execution", ch.status, {
    status: "loading",
  });

  if (!data.variableName && typeof data.variableName === 'string') {
    await step.realtime.publish("publish:openai-execution", ch.status, { status: "error" });
    throw new NonRetriableError("OpenAI node: No variable name configured");
  }

  if (!data.userPrompt) {
    await step.realtime.publish("publish:openai-execution", ch.status, { status: "error" });
    throw new NonRetriableError("OpenAI node: No user prompt configured");
  }

  const systemPrompt = data.systemPrompt
    ? Handlebars.compile(data.systemPrompt)(context)
    : "You are a helpful assistant.";
  
  const userPrompt = data.userPrompt
    ? Handlebars.compile(data.userPrompt)(context)
    : "";

  const openai = createOpenAI({
    apiKey: process.env.OPENAI_API_KEY!,
  });

  try {
    await step.realtime.publish("publish:openai-execution", ch.status, { status: "loading" });

    const { steps } = await step.ai.wrap("openai-generate-text", generateText, {
      model: openai(data.model ?? FALLBACK_MODEL_OPENAI),
      system: systemPrompt,
      prompt: userPrompt,
      telemetry: {
        isEnabled: true,
        recordInputs: true,
        recordOutputs: true,
      }
    });

    await step.realtime.publish("publish:openai-execution", ch.status, { status: "success" });

    const text = steps[0].content[0].type === "text" ? steps[0].content[0].text : "";

    return {
      ...context,
      [data.variableName!]: {
        text
      }
    }
  } catch (error) {
    await step.realtime.publish("publish:openai-execution", ch.status, { status: "error" });
    throw error;
  }
}