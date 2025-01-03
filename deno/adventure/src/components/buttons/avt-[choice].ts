import {
  ActionRow,
  Button,
  MessageComponentInteraction,
} from "@dressed/dressed";
import { story } from "../../story.ts";

const db = await Deno.openKv();

export default async function avtButton(
  interaction: MessageComponentInteraction,
  args: { choice: string },
) {
  if (interaction.message) {
    await interaction.update({
      components: [
        ActionRow(
          ...interaction.message.components![0].components.map((component) => ({
            ...component,
            disabled: true,
          })),
        ),
      ],
    });
    interaction.reply = interaction
      .followUp as unknown as typeof interaction.reply;
  }
  let storyPoint = story[args.choice as keyof typeof story];

  const vars: Deno.KvEntry<unknown>[] = [];
  for await (const key of db.list({ prefix: [interaction.user.id] })) {
    vars.push(key);
  }
  if (storyPoint.when?.length) {
    storyPoint.when.forEach((condition) => {
      if (
        Object.entries(condition.must).some(([key, value]) => {
          return (vars.find((v) => v.key[1] === key)?.value !== value);
        })
      ) return;
      storyPoint = {
        ...storyPoint,
        ...condition.then,
      };
    });
  }
  if (storyPoint.set) {
    for (const key in storyPoint.set) {
      await db.set([interaction.user.id, key], storyPoint.set[key]);
    }
  }
  if (storyPoint.isWin) {
    storyPoint.text = "## You win!\n" + storyPoint.text;
    storyPoint.choices = undefined;
  } else if (storyPoint.isLose) {
    storyPoint.text = "## Too bad!\n" + storyPoint.text;
    storyPoint.choices = undefined;
  }
  if (!storyPoint.choices) {
    return interaction.reply({
      content: storyPoint.text,
      ephemeral: true,
    });
  }
  return interaction.reply({
    content: storyPoint.text.replaceAll(
      /{{ (.+) }}/g,
      (match) => (vars.find((v) => v.key[1] === match)?.value as string),
    ),
    ephemeral: true,
    components: [
      ActionRow(...storyPoint.choices.map((choice) =>
        Button({
          custom_id: `avt-${choice}`,
          label: story[choice].choice.text,
          emoji: { name: story[choice].choice.emoji },
        })
      )),
    ],
  });
}
