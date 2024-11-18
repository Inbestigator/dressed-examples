import {
  ActionRow,
  Button,
  type CommandConfig,
  type CommandInteraction,
} from "@inbestigator/discord-http";
const kv = await Deno.openKv();

export const config: CommandConfig = {
  description: "Gives a random trivia question",
};

export default async function trivia(interaction: CommandInteraction) {
  await interaction.deferReply({
    ephemeral: true,
  });
  const res = await fetch("https://the-trivia-api.com/v2/questions?limit=1");

  const question = (await res.json())[0];

  await kv.atomic().set(["trivia", interaction.user.id], question).commit();

  const answers = deduplicate(
    question.incorrectAnswers.concat(question.correctAnswer),
  );

  const buttons = answers
    .sort(() => Math.random() - 0.5)
    .map((answer: string) =>
      Button({
        label: answer,
        custom_id: `guess_${answer.toLowerCase().replace(/[^a-z]/g, "_")}`,
      })
    );

  await interaction.editReply({
    content:
      `## Trivia!\n${question.question.text}\n-# Difficulty: ${question.difficulty}`,
    components: [ActionRow(...buttons)],
  });
}

function deduplicate(array: string[]) {
  const seen = new Set();
  return array.filter((value) => {
    if (seen.has(value)) {
      return false;
    }
    seen.add(value);
    return true;
  });
}
