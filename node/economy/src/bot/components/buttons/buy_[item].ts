import { MessageComponentInteraction } from "@dressed/dressed";
import db, { getItems, getUser } from "@/db";

export default async function buy_item(
  interaction: MessageComponentInteraction,
  args: { item: string },
) {
  await interaction.deferReply({ ephemeral: true });
  const shopItems = await getItems();
  const user = await getUser(interaction.user.id);
  if (!user) {
    return interaction.editReply("You aren't registered!");
  }

  const item = shopItems.find((i) => i.name.toLowerCase() === args.item);
  if (!item) {
    return interaction.editReply("That item doesn't exist!");
  }

  if (user.balance < item.price) {
    return interaction.editReply(
      "You don't have enough coins to buy that item!",
    );
  }

  user.balance -= item.price;

  await db.batch([
    {
      sql: "UPDATE users SET balance = :balance WHERE discord_id = :id",
      args: { balance: user.balance, id: user.discord_id },
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
