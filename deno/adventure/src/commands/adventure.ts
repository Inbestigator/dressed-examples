import {
  type CommandConfig,
  type CommandInteraction,
  MessageComponentInteraction,
} from "@dressed/dressed";
import avtButton from "../components/buttons/avt-[choice].ts";

export const config: CommandConfig = {
  description: "Start a new adventure!",
};

export default function adventure(interaction: CommandInteraction) {
  return avtButton(interaction as unknown as MessageComponentInteraction, {
    choice: "start",
  });
}
