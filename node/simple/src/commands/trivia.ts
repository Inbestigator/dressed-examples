import { ActionRow, Button, type CommandConfig, type CommandInteraction } from "dressed";

export const triviaData: Record<string, object> = {};

export const config: CommandConfig = {
  description: "Gives a random trivia question",
};

export default async function trivia(interaction: CommandInteraction) {
  await interaction.deferReply({
    ephemeral: true,
  });
  const res = await fetch("https://the-trivia-api.com/v2/questions?limit=1");

  const question = (await res.json())[0];

  triviaData[interaction.user.id] = question;

  const answers = question.incorrectAnswers.concat(question.correctAnswer);

  const buttons = answers
    .sort(() => Math.random() - 0.5)
    .map((answer: string) =>
      Button({
        label: answer,
        custom_id: `guess_${answer.toLowerCase().replace(/[^a-z]/g, "_")}`,
      })
    );

  await interaction.editReply({
    content: `## Trivia!\n${question.text}`,
    components: [ActionRow(...buttons)],
  });
}
