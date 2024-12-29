import { MessageComponentInteraction } from "@dressed/dressed";
import db, { getItems, getUser } from "../../db.ts";

export default function buy_item(
  interaction: MessageComponentInteraction,
  args: { item: string },
) {
  const shopItems = getItems();
  const user = getUser(interaction.user.id);
  if (!user) {
    return interaction.reply({
      content: "You aren't registered!",
      ephemeral: true,
    });
  }

  const item = shopItems.find((i) => i.name.toLowerCase() === args.item);
  if (!item) {
    return interaction.reply({
      content: "That item doesn't exist!",
      ephemeral: true,
    });
  }

  if (user.balance < item.price) {
    return interaction.reply({
      content: "You don't have enough coins to buy that item!",
      ephemeral: true,
    });
  }

  user.balance -= item.price;
  db.prepare(
    "UPDATE users SET balance = :balance WHERE discord_id = :id",
  ).run({ balance: user.balance, id: user.discord_id });
  const userItem = db.prepare(
    "SELECT * FROM user_items WHERE user_id = :user_id AND item_id = :item_id",
  ).get({ user_id: user.id, item_id: item.id });

  if (userItem) {
    db.prepare(
      "UPDATE user_items SET quantity = quantity + 1 WHERE user_id = :user_id AND item_id = :item_id",
    ).run({ user_id: user.id, item_id: item.id });
  } else {
    db.prepare(
      "INSERT INTO user_items (user_id, item_id, quantity) VALUES (:user_id, :item_id, 1)",
    ).run({ user_id: user.id, item_id: item.id });
  }

  return interaction.reply({
    content: `You bought one ${args.item}!`,
    ephemeral: true,
  });
}
