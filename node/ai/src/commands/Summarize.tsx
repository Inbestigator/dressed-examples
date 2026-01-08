import type { CommandInteraction } from "@dressed/react";
import type { CommandConfig } from "dressed";
import { ChatPage } from "../pages/chat";

export const config = {
  type: "Message",
} satisfies CommandConfig;

export default function summarizeCommand(interaction: CommandInteraction<typeof config>) {
  if (!interaction.target.content) {
    return interaction.reply("Nothing to summarize!", { ephemeral: true });
  }
  return interaction.reply(
    <ChatPage
      initial={`Please summarize the following message succinctly: "${interaction.target.content}"`}
    />,
    { ephemeral: true }
  );
}
