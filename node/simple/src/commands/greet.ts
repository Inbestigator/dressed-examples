import type { CommandConfig, CommandInteraction } from "dressed";

export const config = {
  description: "Returns a greeting",
} satisfies CommandConfig;

export default async function greet(interaction: CommandInteraction) {
  await interaction.reply({
    content: `Hey there, ${interaction.user.global_name}!`,
    ephemeral: true,
  });
}
