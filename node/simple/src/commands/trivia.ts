import { ActionRow, Button, type CommandConfig, type CommandInteraction } from "dressed";

export const config: CommandConfig = {
  description: "Gives a random trivia question",
};

export default async function trivia(interaction: CommandInteraction) {
  const [res] = await Promise.all([
    fetch("https://the-trivia-api.com/v2/questions?limit=1"),
    interaction.deferReply({ ephemeral: true }),
  ]);
  const { question, incorrectAnswers, correctAnswer } = (await res.json())[0] as {
    question: { text: string };
    incorrectAnswers: string[];
    correctAnswer: string;
  };
  const answers = incorrectAnswers.concat(correctAnswer);
  const buttons = answers
    .map((label, i) =>
      Button({
        label,
        custom_id: `guess-${i}`,
      })
    )
    .sort(() => Math.random() - 0.5);

  await interaction.editReply({
    content: `## Trivia!\n${question.text}`,
    components: [ActionRow(...buttons)],
  });
}
