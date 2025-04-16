import type { CommandConfig, CommandInteraction } from "@dressed/dressed";
import db from "@/db";

export const config: CommandConfig = {
  description: "Get the top 3 richest users",
};

export default async function register(interaction: CommandInteraction) {
  await interaction.deferReply({ ephemeral: true });
  const users = await db.execute(
    "SELECT * FROM users ORDER BY balance DESC LIMIT 3",
  );

  return interaction.editReply(`## 🏆 Leaderboard
${
    users.rows.map((user, i) =>
      `${i + 1}. ${user.discord_username} - $${user.balance}`
    ).join("\n")
  }`);
}
