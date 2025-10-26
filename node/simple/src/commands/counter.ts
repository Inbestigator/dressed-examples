import { MessageFlags } from "discord-api-types/v10";
import { ActionRow, Button, type CommandConfig, type CommandInteraction, TextDisplay } from "dressed";

export const config = {
  description: "Increments a counter",
} satisfies CommandConfig;

export default async function counter(interaction: CommandInteraction) {
  await interaction.reply({
    components: countDisplay(1),
    ephemeral: true,
    flags: MessageFlags.IsComponentsV2,
  });
}

export function countDisplay(count: number) {
  return [
    TextDisplay(`Current count: ${count}`),
    ActionRow(
      Button({
        label: "Add",
        custom_id: `set-counter-${count + 1}`,
      }),
      Button({
        label: "Reset",
        style: "Danger",
        custom_id: "set-counter-0",
      }),
    ),
  ];
}
