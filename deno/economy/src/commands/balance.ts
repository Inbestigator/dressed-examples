import type { CommandConfig, CommandInteraction } from "@dressed/dressed";
import db, { getUser } from "../db.ts";
import { UserItem } from "../types.ts";

export const config: CommandConfig = {
  description: "View your balance and items",
};

export default function balance(interaction: CommandInteraction) {
  const user = getUser(interaction.user.id);
  if (!user) {
    return interaction.reply({
      content: "You aren't registered!",
      ephemeral: true,
    });
  }
  const userItems = db.prepare(
    `SELECT user_items.*, items.name as item_name 
     FROM user_items 
     JOIN items ON user_items.item_id = items.id 
     WHERE user_items.user_id = :user_id`,
  ).all({
    user_id: user.id,
  }) as unknown as (UserItem & { item_name: string })[];

  return interaction.reply({
    content:
      `**Balance**:\n$${user.balance.toLocaleString()}\n__**Items:**__\n${
        userItems.map((item) => `${item.quantity}x ${item.item_name}`).join(
          "\n",
        )
      }`,
    ephemeral: true,
  });
}
