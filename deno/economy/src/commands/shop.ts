import {
  ActionRow,
  Button,
  CommandConfig,
  CommandInteraction,
} from "@dressed/dressed";
import { getItems } from "../db.ts";

export const config: CommandConfig = {
  description: "View the shop",
};

export default function shop(interaction: CommandInteraction) {
  const shopItems = getItems();
  const rows = [];
  for (let i = 0; i < shopItems.length; i += 5) {
    rows.push(
      ActionRow(
        ...shopItems.slice(i, i + 5).map((item) =>
          Button({
            custom_id: `buy_${item.name.toLowerCase()}`,
            label: `${item.name} - $${item.price}`,
            emoji: { name: item.emoji },
          })
        ),
      ),
    );
  }

  return interaction.reply({
    content: `## 🛍️ Shop`,
    components: rows,
    ephemeral: true,
  });
}
