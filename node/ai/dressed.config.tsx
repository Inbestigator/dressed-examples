import { createGroq } from "@ai-sdk/groq";
import { patchInteraction } from "@dressed/react";
import type { ServerConfig } from "dressed/server";

export const languageModel = createGroq({ apiKey: process.env.AI_API_KEY }).languageModel(
  "llama-3.1-8b-instant"
);

export default {
  build: { extensions: ["tsx", "ts"] },
  port: 3000,
  middleware: {
    commands: (i) => [patchInteraction(i)],
    components: (i, ...p) => [patchInteraction(i), ...p],
  },
} satisfies ServerConfig;
