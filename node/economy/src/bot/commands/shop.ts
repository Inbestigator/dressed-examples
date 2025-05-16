import { ActionRow, Button, CommandConfig, CommandInteraction } from "dressed";
import { getItems } from "@/db";

export const config: CommandConfig = {
  description: "View the shop",
};

export default async function shop(interaction: CommandInteraction) {
  await interaction.deferReply({ ephemeral: true });
  const shopItems = await getItems();
  const rows: ReturnType<typeof ActionRow<ReturnType<typeof Button>>>[] = [];

  for (let i = 0; i < shopItems.length; i += 5) {
    rows.push(
      ActionRow(
        ...shopItems.slice(i, i + 5).map((item) =>
          Button({
            custom_id: `buy_${item.name.toLowerCase()}`,
            label: `${item.name} - $${item.price}`,
            emoji: { name: item.emoji },
          })
        )
      )
    );
  }

  return interaction.editReply({
    content: `## 🛍️ Shop`,
    components: rows,
  });
}
