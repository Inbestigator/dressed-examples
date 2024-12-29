import {
  ActionRow,
  Button,
  type CommandConfig,
  type CommandInteraction,
} from "@dressed/dressed";
const kv = await Deno.openKv();

export const config: CommandConfig = {
  description: "Increments a counter",
};

export default async function counter(interaction: CommandInteraction) {
  await kv.atomic().sum(["counter"], 1n).commit();

  const count = await kv.get(["counter"]);

  await interaction.reply({
    content: showCount(count.value),
    ephemeral: true,
    components: [
      ActionRow(
        Button({
          label: "Add",
          custom_id: "add_counter",
        }),
        Button({
          label: "Reset",
          style: "Danger",
          custom_id: "reset_counter",
        }),
      ),
    ],
  });
}

export function showCount(count: unknown) {
  return `I've been run ${count} time${count == 1 ? "" : "s"}!`;
}
