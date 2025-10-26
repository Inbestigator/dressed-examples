import type { Params } from "@dressed/matcher";
import type { MessageComponentInteraction } from "dressed";
import { countDisplay } from "../../commands/counter.ts";

export const pattern = "set-counter-:value(\\d+)";

export default async function resetCounter(
  interaction: MessageComponentInteraction,
  { value }: Params<typeof pattern>,
) {
  await interaction.update({ components: countDisplay(Number(value)) });
}
