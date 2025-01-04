import {
  type CommandConfig,
  type CommandInteraction,
  MessageComponentInteraction,
} from "@dressed/dressed";
import avtButton from "../components/buttons/avt-[choice].ts";

export const config: CommandConfig = {
  description: "Start a new adventure!",
};

const db = await Deno.openKv();

export default async function adventure(interaction: CommandInteraction) {
  for await (const key of db.list({ prefix: [interaction.user.id] })) {
    await db.delete(key.key);
  }
  return avtButton(interaction as unknown as MessageComponentInteraction, {
    choice: "start",
  });
}
