import { MessageComponentInteraction } from "@dressed/dressed";
import { showCount } from "../../commands/counter.ts";
const kv = await Deno.openKv();

export default async function resetCounter(
  interaction: MessageComponentInteraction,
) {
  await kv.atomic().sum(["counter"], 1n).commit();

  const count = await kv.get(["counter"]);

  await interaction.update(showCount(count.value));
}
