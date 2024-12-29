import type { CommandConfig, CommandInteraction } from "@dressed/dressed";
import db, { getUser } from "../db.ts";

export const config: CommandConfig = {
  description: "Claim your daily reward",
};

export default function balance(interaction: CommandInteraction) {
  const user = getUser(interaction.user.id);
  if (!user) {
    return interaction.reply({
      content: "You aren't registered!",
      ephemeral: true,
    });
  } else if (
    user.last_daily_reward &&
    new Date(user.last_daily_reward).getTime() - Date.now() < 86400000
  ) {
    return interaction.reply({
      content: "You have already claimed your daily reward!",
      ephemeral: true,
    });
  }

  user.balance += 50;
  db.prepare(
    "UPDATE users SET balance = :balance, last_daily_reward = :now WHERE discord_id = :id",
  ).run(
    {
      balance: user.balance,
      now: new Date(),
      id: user.discord_id,
    },
  );

  return interaction.reply({
    content: `You have been given $50! Your new balance is $${user.balance}.`,
    ephemeral: true,
  });
}
