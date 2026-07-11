import type { Params } from "@dressed/matcher";
import type { ComponentInteraction } from "dressed";
import { countDisplay } from "../../commands/counter.ts";

export const pattern = "set-counter-:value(\\d+)";

export default async function resetCounter(interaction: ComponentInteraction, { value }: Params<typeof pattern>) {
  await interaction.update({ components: countDisplay(Number(value)) });
}
