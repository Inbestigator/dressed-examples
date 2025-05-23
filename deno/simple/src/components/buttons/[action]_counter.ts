import type { MessageComponentInteraction } from "@dressed/dressed";
import { showCount } from "../../commands/counter.ts";
const kv = await Deno.openKv();

export default async function counterAction(
  interaction: MessageComponentInteraction,
  { action }: { action: "add" | "reset" },
) {
  if (action === "reset") {
    await kv.atomic().delete(["counter"]).commit();
    await interaction.update(showCount(0));
    await interaction.followUp({
      content: "Counter has been reset!",
      ephemeral: true,
    });
  } else if (action === "add") {
    await kv.atomic().sum(["counter"], 1n).commit();
    const count = await kv.get(["counter"]);
    await interaction.update(showCount(count.value));
  }
}
