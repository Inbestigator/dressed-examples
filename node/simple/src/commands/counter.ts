import {
  ActionRow,
  Button,
  TextDisplay,
  type CommandConfig,
  type CommandInteraction,
} from "dressed";

export const config: CommandConfig = {
  description: "Increments a counter",
};

export default async function counter(interaction: CommandInteraction) {
  await interaction.reply({
    components: countDisplay(1),
    ephemeral: true,
    flags: 1 << 15,
  });
}

export function countDisplay(count: number) {
  return [
    TextDisplay(`I've been run ${count} time${count === 1 ? "" : "s"}!`),
    ActionRow(
      Button({
        label: "Add",
        custom_id: `set-counter-${count + 1}`,
      }),
      Button({
        label: "Reset",
        style: "Danger",
        custom_id: "set-counter-0",
      })
    ),
  ];
}
