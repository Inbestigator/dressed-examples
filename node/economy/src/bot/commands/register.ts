import type { CommandConfig, CommandInteraction } from "dressed";
import db, { getUser } from "@/db";

export const config: CommandConfig = {
  description: "Register yourself in the economy system",
};

export default async function register(interaction: CommandInteraction) {
  await interaction.deferReply({ ephemeral: true });
  const user = await getUser(interaction.user.id);
  if (user) {
    return interaction.editReply("You are already registered!");
  }

  interaction.editReply("You have been registered!\nYou've been given 100 coins to start with.");

  await db.execute({
    sql: "INSERT INTO users (discord_id, discord_username) VALUES (:id, :username)",
    args: { id: interaction.user.id, username: interaction.user.global_name },
  });
}
