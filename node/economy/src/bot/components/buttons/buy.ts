import type { MessageComponentInteraction } from "dressed";
import type { Params } from "@dressed/matcher";
import db, { getItems, getUser } from "@/db";

export const pattern = "buy_:item";

export default async function buyItem(
  interaction: MessageComponentInteraction,
  args: Params<typeof pattern>
) {
  const [shopItems, user] = await Promise.all([
    getItems(),
    getUser(interaction.user.id),
    interaction.deferReply({ ephemeral: true }),
  ]);
  if (!user) {
    return interaction.editReply("You aren't registered!");
  }

  const item = shopItems.find((i) => i.name.toLowerCase() === args.item);
  if (!item) {
    return interaction.editReply("That item doesn't exist!");
  }

  if (user.balance < item.price) {
    return interaction.editReply("You don't have enough coins to buy that item!");
  }

  await db.batch([
    {
      sql: "UPDATE users SET balance = :balance WHERE discord_id = :id",
      args: { balance: user.balance - item.price, id: user.discord_id },
    },
    {
      sql: `
      INSERT INTO user_items (user_id, item_id, quantity) VALUES (:user_id, :item_id, 1)
      ON CONFLICT (user_id, item_id) DO UPDATE
        SET quantity = user_items.quantity + 1
    `,
      args: { user_id: user.id, item_id: item.id },
    },
  ]);

  return interaction.editReply(`You bought one ${args.item}!`);
}
