import type { CommandConfig, ComponentInteraction } from "dressed";
import avtButton from "@/components/buttons/adventure-button";

export const config = {
  description: "Start a new adventure!",
} satisfies CommandConfig;

export default function (interaction: ComponentInteraction) {
  return avtButton(interaction, { choice: "start", vars: "{}" });
}
