import type { CommandInteraction } from "@dressed/react";
import type { CommandConfig } from "dressed";
import db, { getUser } from "@/db";

export const config = {
  description: "Register yourself in the economy system",
} satisfies CommandConfig;

export default async function register(interaction: CommandInteraction) {
  const [user] = await Promise.all([getUser(interaction.user.id), interaction.deferReply({ ephemeral: true })]);

  if (user) {
    return interaction.editReply("You are already registered!");
  }

  interaction.editReply("You have been registered!\nYou've been given 100 coins to start with.");

  await db.execute({
    sql: "INSERT INTO users (discord_id, discord_username) VALUES (:id, :username)",
    args: { id: interaction.user.id, username: interaction.user.global_name },
  });
}
