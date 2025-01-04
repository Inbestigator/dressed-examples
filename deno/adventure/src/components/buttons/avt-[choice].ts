import {
  ActionRow,
  Button,
  MessageComponentInteraction,
} from "@dressed/dressed";
import { story } from "../../story.ts";

const db = await Deno.openKv();

function random(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

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

  const vars: Record<string, string> = {};
  for await (const key of db.list({ prefix: [interaction.user.id] })) {
    vars[key.key[1].toString()] = key.value as string;
  }
  if (storyPoint.conditions?.length) {
    for (const condition of storyPoint.conditions) {
      if (
        Object.entries(condition.if).some(([key, value]) => {
          if (/\d\/\d/.test(key)) {
            const [min, max] = key.split("/").map(Number);
            return random(min, max) === parseInt(value);
          }
          return (vars[key] !== value);
        })
      ) continue;
      if (condition.join) {
        storyPoint = {
          ...storyPoint,
          ...condition.then,
          choices: (storyPoint.choices ?? []).concat(
            condition.then.choices ?? [],
          ),
          set: {
            ...(storyPoint.set ?? {}),
            ...(condition.then.set ?? {}),
          },
        };
      } else {
        storyPoint = {
          ...storyPoint,
          ...condition.then,
        };
      }

      if (condition.stop) break;
    }
  }
  if (storyPoint.set) {
    for (const key in storyPoint.set) {
      let value = storyPoint.set[key];
      if (typeof value === "function") {
        value = value(vars);
      }
      await db.set([interaction.user.id, key], value);
      vars[key] = value;
    }
  }
  if (storyPoint.isWin) {
    storyPoint.text = "## You win!\n" + storyPoint.text;
    storyPoint.choices = undefined;
  } else if (storyPoint.isLose) {
    storyPoint.text = "## Too bad!\n" + storyPoint.text;
    storyPoint.choices = undefined;
  }
  storyPoint.text = storyPoint.text.replaceAll(
    /{{ (.+?) }}/g,
    (_m, k) => (vars[k]),
  );
  if (!storyPoint.choices) {
    return interaction.reply({
      content: storyPoint.text,
      ephemeral: true,
    });
  }
  return interaction.reply({
    content: storyPoint.text,
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
