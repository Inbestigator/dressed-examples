import { Button, MessageComponentInteraction } from "@dressed/dressed";
const kv = await Deno.openKv();

export default async function sweep(
  interaction: MessageComponentInteraction,
  { x, y }: Record<string, string>,
) {
  const minesPos = (await kv.get(["sweeper", interaction.user.id]))
    .value as number[];

  const mines = getMineCount(minesPos, Number(x), Number(y));

  if (mines === -1) {
    const updatedRows = (interaction.message.components?.filter((c) =>
      c.type === 1
    ))?.map((r, i) => ({
      ...r,
      components: r.components.map((b, j) => {
        if (b.type === 2 && b.style === 2) {
          return b;
        }
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
      components: updatedRows,
    });
    return;
  }

  let numCovered = -1;

  let updatedRows =
    (interaction.message.components?.filter((c) => c.type === 1))?.map(
      (r, i) => {
        r.components.forEach((b) => {
          if (!b.disabled) numCovered++;
        });
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
      },
    );

  if (numCovered === minesPos.length) {
    updatedRows = (interaction.message.components?.filter((c) => c.type === 1))
      ?.map((r, i) => ({
        ...r,
        components: r.components.map((b, j) => {
          if (b.type === 2 && b.style === 2) return b;
          const mines = getMineCount(minesPos, j, i);

          return Button({
            label: mines !== -1 ? mines.toString() : undefined,
            emoji: mines === -1 ? { name: "💣" } : undefined,
            disabled: true,
            style: mines === -1 ? "Success" : "Secondary",
            custom_id: `sweep_${j}_${i}`,
          });
        }),
      }));
  }

  await interaction.update({
    components: updatedRows,
  });
}

export function getMineCount(minesPos: number[], x: number, y: number) {
  const size = 5;
  const pos = x * size + y;

  if (minesPos.includes(pos)) {
    return -1;
  }
  let mineCount = 0;

  for (let dx = -1; dx <= 1; dx++) {
    for (let dy = -1; dy <= 1; dy++) {
      const nx = x + dx;
      const ny = y + dy;
      if (nx < 0 || nx >= size || ny < 0 || ny >= size) continue;
      const neighborPos = nx * size + ny;

      if (minesPos.includes(neighborPos)) {
        mineCount++;
      }
    }
  }

  return mineCount;
}
