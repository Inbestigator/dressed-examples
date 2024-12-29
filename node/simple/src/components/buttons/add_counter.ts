import { MessageComponentInteraction } from "@dressed/dressed";
import { count, setCount, showCount } from "../../commands/counter.ts";

export default async function resetCounter(
  interaction: MessageComponentInteraction,
) {
  setCount(count + 1);

  await interaction.update(showCount(count));
}
