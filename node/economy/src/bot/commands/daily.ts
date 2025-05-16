import type { CommandConfig, CommandInteraction } from "dressed";
import db, { getUser } from "@/db";

export const config: CommandConfig = {
  description: "Claim your daily reward",
};

export default async function balance(interaction: CommandInteraction) {
  await interaction.deferReply({ ephemeral: true });
  const user = await getUser(interaction.user.id);
  if (!user) {
    return interaction.editReply("You aren't registered!");
  } else if (
    user.last_daily_reward &&
    Date.now() - new Date(user.last_daily_reward).getTime() < 86400000
  ) {
    return interaction.editReply("You have already claimed your daily reward!");
  }

  user.balance += 50;
  interaction.editReply(`You have been given $50! Your new balance is $${user.balance}.`);
  await db.execute({
    sql: "UPDATE users SET balance = :balance, last_daily_reward = :now WHERE discord_id = :id",
    args: {
      balance: user.balance,
      now: new Date(),
      id: user.discord_id,
    },
  });
}
