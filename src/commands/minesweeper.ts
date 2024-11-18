import {
  ActionRow,
  Button,
  type CommandConfig,
  type CommandInteraction,
} from "@inbestigator/discord-http";

const kv = await Deno.openKv();

export const config: CommandConfig = {
  description: "Play a game of minesweeper",
  options: [
    {
      name: "difficulty",
      description: "The number of mines, leave blank for medium difficulty",
      type: 3,
      choices: [
        { name: "Easy", value: "easy" },
        { name: "Hard", value: "hard" },
      ],
    },
  ],
};

export default async function minesweeper(interaction: CommandInteraction) {
  await interaction.deferReply({
    ephemeral: true,
  });

  let difficulty = "medium";

  if ("options" in interaction.data && interaction.data.options) {
    const difficultyOption = interaction.data.options.find(
      (option) => option.name === "difficulty",
    );
    if (difficultyOption && difficultyOption.type === 3) {
      difficulty = difficultyOption.value;
    }
  }

  const mines = generateMines(difficulty);

  await kv.atomic().set(["sweeper", interaction.user.id], mines).commit();

  const actionRows = Array(5)
    .fill(0)
    .map((_row, y) =>
      ActionRow(
        ...Array(5)
          .fill(0)
          .map((_col, x) =>
            Button({
              emoji: { name: "❔" },
              custom_id: `sweep_${x}_${y}`,
            })
          ),
      )
    );

  await interaction.editReply({
    components: actionRows,
  });
}

function generateMines(difficulty: string) {
  const size = 5 * 5;
  let mineCount: number;

  switch (difficulty) {
    case "easy":
      mineCount = Math.floor(size * 0.1);
      break;
    case "hard":
      mineCount = Math.floor(size * 0.3);
      break;
    default:
      mineCount = Math.floor(size * 0.2);
  }

  const mines = new Set<number>();
  while (mines.size < mineCount) {
    const pos = Math.floor(Math.random() * size);
    mines.add(pos);
  }

  return Array.from(mines).sort((a, b) => a - b);
}
