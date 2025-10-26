import type { CommandConfig, MessageComponentInteraction } from "dressed";
import avtButton from "@/components/buttons/adventure-button";

export const config = {
  description: "Start a new adventure!",
} satisfies CommandConfig;

export default function adventure(interaction: MessageComponentInteraction) {
  return avtButton(interaction, { choice: "start", vars: "{}" });
}
