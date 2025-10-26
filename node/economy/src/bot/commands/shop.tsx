import { ActionRow, Button, type CommandInteraction, Container } from "@dressed/react";
import type { CommandConfig } from "dressed";
import { getItems } from "@/db";

export const config = {
  description: "View the shop",
} satisfies CommandConfig;

export default async function shop(interaction: CommandInteraction) {
  const [shopItems] = await Promise.all([getItems(), interaction.deferReply({ ephemeral: true })]);
  return interaction.editReply(
    <Container>
      ## 🛍️ Shop
      {chunk(shopItems, 5).map((row, i) => (
        <ActionRow key={i.toString()}>
          {row.map((item) => (
            <Button
              key={item.id}
              custom_id={`buy_${item.name.toLowerCase()}`}
              label={`${item.name} - $${item.price}`}
              emoji={{ name: item.emoji }}
            />
          ))}
        </ActionRow>
      ))}
    </Container>,
  );
}

function chunk<T>(arr: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
}
