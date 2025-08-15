import type { CommandConfig, CommandInteraction, MessageComponentInteraction } from "dressed";
import avtButton from "@/components/buttons/avt-:choice-:vars";

export const config: CommandConfig = {
  description: "Start a new adventure!",
};

export default function adventure(interaction: CommandInteraction) {
  return avtButton(interaction as unknown as MessageComponentInteraction, {
    choice: "start",
    vars: "{}",
  });
}
