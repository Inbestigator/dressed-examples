import { ActionRow, Button, MessageComponentInteraction } from "dressed";

export default async function guess(
  interaction: MessageComponentInteraction,
  { num }: { num: string }
) {
  const buttons = interaction.message.components!.find((c) => c.type === 1)!.components as {
    custom_id: string;
  }[];
  const updatedButtons =
    buttons.map((b) =>
      Button({
        ...b,
        style: b.custom_id.endsWith("3") ? "Success" : "Danger",
        disabled: true,
      })
    ) ?? [];
  await interaction.update({
    content: `## ${num === "3" ? "Correct" : "Nice try"}!\n${
      interaction.message.content.split("\n")[1]
    }`,
    components: [ActionRow(...updatedButtons)],
  });
}
