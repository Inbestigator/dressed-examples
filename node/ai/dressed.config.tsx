import { createGroq } from "@ai-sdk/groq";
import { patchInteraction } from "@dressed/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ServerConfig } from "dressed/server";
import type { PropsWithChildren } from "react";

const queryClient = new QueryClient();

function BotProviders({ children }: Readonly<PropsWithChildren>) {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

export const languageModel = createGroq({ apiKey: process.env.AI_API_KEY }).languageModel(
  "llama-3.1-8b-instant"
);

export default {
  build: { extensions: ["tsx", "ts"] },
  port: 3000,
  middleware: {
    commands: (i) => [patchInteraction(i, BotProviders)],
    components: (i, ...p) => [patchInteraction(i, BotProviders), ...p],
  },
} satisfies ServerConfig;
