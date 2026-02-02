import type { CommandInteraction } from "@dressed/react";
import type { CommandConfig } from "dressed";
import { ChatPage } from "../pages/chat";

export const config = {
  description: "Message the AI bot",
} satisfies CommandConfig;

export default function chatCommand(interaction: CommandInteraction) {
  return interaction.reply(<ChatPage prompt={{ label: "Send a message", modal: "Send a message" }} />, {
    ephemeral: true,
  });
}
