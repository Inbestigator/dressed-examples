import type { CommandConfig, CommandInteraction } from "@dressed/dressed";
import db, { getUser } from "../db.ts";

export const config: CommandConfig = {
  description: "Register yourself in the economy system",
};

export default function register(interaction: CommandInteraction) {
  const user = getUser(interaction.user.id);
  if (user) {
    return interaction.reply({
      content: "You are already registered!",
      ephemeral: true,
    });
  }

  db.prepare(
    "INSERT INTO users (discord_id, discord_username) VALUES (:id, :username)",
  ).run({ id: interaction.user.id, username: interaction.user.global_name });

  return interaction.reply({
    content:
      "You have been registered!\nYou've been given 100 coins to start with.",
    ephemeral: true,
  });
}
