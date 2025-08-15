import { type CommandInteraction, Container, TextDisplay } from "@dressed/react";
import type { CommandConfig } from "dressed";
import { Fragment } from "react";
import { User } from "@/types";
import db from "@/db";

export const config: CommandConfig = {
  description: "Get the top 3 richest users",
};

export default async function register(interaction: CommandInteraction) {
  const [{ rows: users }] = await Promise.all([
    db.execute("SELECT * FROM users ORDER BY balance DESC LIMIT 3"),
    interaction.deferReply({ ephemeral: true }),
  ]);

  return interaction.editReply(
    <Container>
      ## 🏆 Leaderboard
      <TextDisplay>
        {(users as unknown as User[]).map((user, i) => (
          <Fragment key={i}>
            {i + 1}. {user.discord_username} - ${user.balance}
            {"\n"}
          </Fragment>
        ))}
      </TextDisplay>
    </Container>
  );
}
