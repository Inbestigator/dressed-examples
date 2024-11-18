import {
  Button,
  MessageComponentInteraction,
} from "@inbestigator/discord-http";
const kv = await Deno.openKv();

export default async function sweep(
  interaction: MessageComponentInteraction,
  { x, y }: Record<string, string>,
) {
  const minesPos = (await kv.get(["sweeper", interaction.user.id]))
    .value as number[];

  const mines = getMineCount(minesPos, Number(x), Number(y));

  if (mines === -1) {
    const updatedRows = interaction.message.components?.map((r, i) => ({
      ...r,
      components: r.components.map((b, j) => {
        if (b.type === 2 && b.style === 2) return b;
        if (j !== Number(x) || i !== Number(y)) {
          const mines = getMineCount(minesPos, j, i);

          return Button({
            label: mines !== -1 ? mines.toString() : undefined,
            emoji: mines === -1 ? { name: "💣" } : undefined,
            disabled: true,
            custom_id: `sweep_${j}_${i}`,
          });
        }

        return Button({
          emoji: {
            name: "💥",
          },
          style: "Danger",
          disabled: true,
          custom_id: `sweep_${x}_${y}`,
        });
      }),
    }));

    await interaction.update({
      components: updatedRows ?? [],
    });
    return;
  }

  const updatedRows = interaction.message.components?.map((r, i) => {
    if (i !== Number(y)) return r;

    return {
      ...r,
      components: r.components.map((b, j) => {
        if (j !== Number(x)) return b;

        return Button({
          label: mines.toString(),
          style: "Secondary",
          disabled: true,
          custom_id: `sweep_${x}_${y}`,
        });
      }),
    };
  });

  await interaction.update({
    components: updatedRows,
  });
}

function getMineCount(minesPos: number[], x: number, y: number) {
  const size = 5;
  const pos = x * size + y;

  if (minesPos.includes(pos)) {
    return -1;
  }

  const directions = [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1],
  ];

  return directions
    .map(([dx, dy]) => {
      const nx = x + dx;
      const ny = y + dy;

      const neighborPos = nx * size + ny;
      if (minesPos.includes(neighborPos)) {
        return true;
      }
    })
    .filter(Boolean).length;
}
