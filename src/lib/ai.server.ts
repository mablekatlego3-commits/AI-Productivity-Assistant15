import { streamText } from "ai";
import {
  createLovableAiGatewayProvider,
  gatewayErrorMessage,
  requireApiKey,
  WORKMATE_MODEL,
} from "./ai-gateway.server";

export async function runPrompt(prompt: string) {
  try {
    const gateway = createLovableAiGatewayProvider(requireApiKey());
    const result = streamText({
      model: gateway(WORKMATE_MODEL),
      prompt,
    });
    const text = await result.text;
    if (!text.trim()) throw new Error("The AI returned an empty response.");
    return { text };
  } catch (error) {
    throw new Error(gatewayErrorMessage(error));
  }
}
