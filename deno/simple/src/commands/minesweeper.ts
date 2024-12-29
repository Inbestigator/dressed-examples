import {
  ActionRow,
  Button,
  type CommandConfig,
  type CommandInteraction,
} from "@dressed/dressed";
import { getMineCount } from "../components/buttons/sweep_[x]_[y].ts";

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

  const difficulty = interaction.getOption("difficulty")?.string() ?? "medium";

  const mines = generateMines(difficulty);

  await kv.atomic().set(["sweeper", interaction.user.id], mines).commit();
  let revealedNum = 0;

  const actionRows = Array(5)
    .fill(0)
    .map((_row, y) =>
      ActionRow(
        ...Array(5)
          .fill(0)
          .map((_col, x) => {
            if (
              Math.random() < 0.2 &&
              revealedNum < (difficulty === "easy" ? 2 : 1) &&
              getMineCount(mines, x, y) !== -1
            ) {
              revealedNum++;
              return Button({
                label: getMineCount(mines, x, y).toString(),
                style: "Secondary",
                disabled: true,
                custom_id: `sweep_${x}_${y}`,
              });
            }

            return Button({
              emoji: { name: "❔" },
              custom_id: `sweep_${x}_${y}`,
            });
          }),
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
