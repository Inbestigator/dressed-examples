import { type CommandInteraction, Container, TextDisplay } from "@dressed/react";
import { type CommandConfig, CommandOption } from "dressed";
import db, { getUser } from "@/db.ts";
import type { UserItem } from "@/types";

export const config = {
  description: "View a user's balance and items (default is you)",
  options: [CommandOption({ type: "User", name: "user", description: "The user whose balance to check" })],
} satisfies CommandConfig;

export default async function (interaction: CommandInteraction<typeof config>) {
  const discordUser = interaction.options.user ?? interaction.user;
  const [user] = await Promise.all([getUser(discordUser.id), interaction.deferReply({ ephemeral: true })]);

  if (!user) {
    return interaction.editReply(`${discordUser.id === interaction.user.id ? "You" : "They"} aren't registered!`);
  }

  const userItems = (
    await db.execute({
      sql: `
        SELECT user_items.*, items.name as item_name FROM user_items 
        JOIN items ON user_items.item_id = items.id WHERE user_items.user_id = :user_id`,
      args: { user_id: user.id },
    })
  ).rows as unknown as (UserItem & { item_name: string })[];

  return interaction.editReply(
    <Container>
      ## 👛 {discordUser.global_name ?? discordUser.username}
      <TextDisplay>### Balance:</TextDisplay>${user.balance.toLocaleString()}
      <TextDisplay>### Items:</TextDisplay>
      {userItems.map((item) => `${item.quantity}× ${item.item_name}`).join("\n")}
    </Container>,
  );
}
