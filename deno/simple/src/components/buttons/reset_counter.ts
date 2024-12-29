import { MessageComponentInteraction } from "@dressed/dressed";
import { showCount } from "../../commands/counter.ts";
const kv = await Deno.openKv();

export default async function resetCounter(
  interaction: MessageComponentInteraction,
) {
  await kv.atomic().delete(["counter"]).commit();

  await interaction.update(showCount(0));

  await interaction.followUp({
    content: "Counter has been reset!",
    ephemeral: true,
  });
}
