import { ActionRow, type MessageComponentInteraction } from "@dressed/dressed";
import type { Params } from "@dressed/matcher";

const kv = await Deno.openKv();

export const pattern = "guess_:answer";

export default async function guess(interaction: MessageComponentInteraction, { answer }: Params<typeof pattern>) {
  const question = (await kv.get(["trivia", interaction.user.id])).value as {
    correctAnswer: string;
  };

  const updatedButtons =
    interaction.message.components
      ?.find((c) => c.type === 1)
      ?.components.map((b) => ({
        ...b,
        style: (b as { label: string }).label === question.correctAnswer ? 3 : 4,
        disabled: true,
      })) ?? [];

  if (question.correctAnswer.toLowerCase().replace(/[^a-z]/g, "_") !== answer) {
    await interaction.update({
      content: `## Nice try!\n${interaction.message.content.split("\n")[1]}`,
      components: [ActionRow(...updatedButtons)],
    });
    return;
  }

  await interaction.update({
    content: `## Correct!\n${interaction.message.content.split("\n")[1]}`,
    components: [ActionRow(...updatedButtons)],
  });
}
