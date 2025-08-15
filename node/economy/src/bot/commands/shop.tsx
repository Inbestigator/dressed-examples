import { type CommandInteraction, ActionRow, Button, Container } from "@dressed/react";
import { CommandConfig } from "dressed";
import { getItems } from "@/db";

export const config: CommandConfig = {
  description: "View the shop",
};

export default async function shop(interaction: CommandInteraction) {
  const [shopItems] = await Promise.all([getItems(), interaction.deferReply({ ephemeral: true })]);
  return interaction.editReply(
    <Container>
      ## 🛍️ Shop
      {chunk(shopItems, 5).map((row, i) => (
        <ActionRow key={i}>
          {row.map((item, i) => (
            <Button
              key={i}
              custom_id={`buy_${item.name.toLowerCase()}`}
              label={`${item.name} - $${item.price}`}
              emoji={{ name: item.emoji }}
            />
          ))}
        </ActionRow>
      ))}
    </Container>
  );
}

function chunk<T>(arr: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
}
