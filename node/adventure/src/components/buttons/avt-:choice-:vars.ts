import { ActionRow, Button, type MessageComponentInteraction } from "dressed";
import { story } from "@/story.ts";

function random(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default function avtButton(
  interaction: MessageComponentInteraction,
  args: { choice: string; vars: string }
) {
  if (interaction.message) {
    interaction.reply = interaction.update as unknown as typeof interaction.reply;
  }
  let storyPoint = story[args.choice as keyof typeof story];

  const vars: Record<string, string> = JSON.parse(args.vars);
  if (storyPoint.conditions?.length) {
    for (const condition of storyPoint.conditions) {
      if (
        Object.entries(condition.if).some(([key, value]) => {
          if (/\d\/\d/.test(key)) {
            const [min, max] = key.split("/").map(Number);
            return random(min ?? 0, max ?? 0) === parseInt(value);
          }
          return vars[key] !== value;
        })
      )
        continue;
      if (condition.join) {
        storyPoint = {
          ...storyPoint,
          ...condition.then,
          choices: (storyPoint.choices ?? []).concat(condition.then.choices ?? []),
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
      if (value) {
        vars[key] = value;
      }
    }
  }
  if (storyPoint.isWin) {
    storyPoint.text = "## You win!\n" + storyPoint.text;
    storyPoint.choices = undefined;
  } else if (storyPoint.isLose) {
    storyPoint.text = "## Too bad!\n" + storyPoint.text;
    storyPoint.choices = undefined;
  }
  storyPoint.text = storyPoint.text.replaceAll(/{{ (.+?) }}/g, (_, k) => vars[k] ?? "");
  if (!storyPoint.choices) {
    return interaction.reply({
      content: storyPoint.text,
      ephemeral: true,
      components: [],
    });
  }
  return interaction.reply({
    content: storyPoint.text,
    ephemeral: true,
    components: [
      ActionRow(
        ...storyPoint.choices.map((choice) =>
          Button({
            custom_id: `avt-${choice}-${JSON.stringify(vars)}`,
            label: story[choice].choice.text,
            emoji: { name: story[choice].choice.emoji },
          })
        )
      ),
    ],
  });
}
