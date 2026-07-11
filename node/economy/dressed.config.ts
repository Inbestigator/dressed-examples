import type { DressedConfig } from "@dressed/framework";
import { patchInteraction } from "@dressed/react";

export default {
  build: { root: "src/bot", include: ["**/*.{ts,tsx}"] },
  hooks: {
    onBeforeCommand: (i) => [patchInteraction(i)],
    onBeforeComponent: (i, ...p) => [patchInteraction(i), ...p],
  },
} satisfies DressedConfig;
