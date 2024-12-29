import type { CommandConfig, CommandInteraction } from "@dressed/dressed";
import db from "../db.ts";

export const config: CommandConfig = {
  description: "Get the top 3 richest users",
};

export default function register(interaction: CommandInteraction) {
  const users = db.prepare("SELECT * FROM users ORDER BY balance DESC LIMIT 3")
    .all();

  return interaction.reply({
    content: `## 🏆 Leaderboard
${
      users.map((user, i) =>
        `${i + 1}. ${user.discord_username} - $${user.balance}`
      ).join("\n")
    }`,
    ephemeral: true,
  });
}
