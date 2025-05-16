import type { CommandConfig, CommandInteraction } from "dressed";
import db, { getUser } from "@/db.ts";
import { UserItem } from "@/types";

export const config: CommandConfig = {
  description: "View your balance and items",
};

export default async function balance(interaction: CommandInteraction) {
  await interaction.deferReply({ ephemeral: true });
  const user = await getUser(interaction.user.id);
  if (!user) {
    return interaction.editReply("You aren't registered!");
  }
  const userItems = (
    await db.execute({
      sql: `SELECT user_items.*, items.name as item_name 
     FROM user_items 
     JOIN items ON user_items.item_id = items.id 
     WHERE user_items.user_id = :user_id`,
      args: { user_id: user.id },
    })
  ).rows as unknown as (UserItem & { item_name: string })[];

  return interaction.editReply(
    `**Balance**:\n$${user.balance.toLocaleString()}\n**Items:**\n${userItems
      .map((item) => `${item.quantity}x ${item.item_name}`)
      .join("\n")}`
  );
}
