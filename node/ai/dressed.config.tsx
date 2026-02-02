import { createGroq } from "@ai-sdk/groq";
import type { DressedConfig } from "@dressed/framework";
import { patchInteraction } from "@dressed/react";

export const languageModel = createGroq({ apiKey: process.env.AI_API_KEY }).languageModel("llama-3.1-8b-instant");

export default {
  build: { extensions: ["tsx", "ts"] },
  port: 3000,
  middleware: {
    commands: (i) => [patchInteraction(i)],
    components: (i, ...p) => [patchInteraction(i), ...p],
  },
} satisfies DressedConfig;
