import { createGroq } from "@ai-sdk/groq";
import type { DressedConfig } from "@dressed/framework";
import { type Params, patternToRegex } from "@dressed/matcher";
import { type ComponentInteraction, type ModalInteraction, patchInteraction } from "@dressed/react";
import { createCallbackHandler, pattern } from "@dressed/react/callbacks";

export const languageModel = createGroq({ apiKey: process.env.AI_API_KEY }).languageModel("llama-3.1-8b-instant");

const callbackHandler = createCallbackHandler({
  default(interaction: ComponentInteraction | ModalInteraction) {
    return interaction.reply("Couldn't find a handler for that interaction", { ephemeral: true });
  },
});

export default {
  build: { include: ["**/*.{ts,tsx}"] },
  hooks: {
    onBeforeCommand: (i) => [patchInteraction(i)],
    onBeforeComponent: (i, ...p) => [patchInteraction(i), ...p],
    onUnknownInteraction(i) {
      if (i.type !== 3 && i.type !== 5) return;
      const args = patternToRegex(pattern).exec(i.data.custom_id)?.groups as Params<typeof pattern>;
      return callbackHandler(i as Parameters<typeof callbackHandler>[0], args);
    },
  },
} satisfies DressedConfig;
