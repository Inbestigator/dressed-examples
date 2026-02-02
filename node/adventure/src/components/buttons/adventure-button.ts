import type { Params } from "@dressed/matcher";
import { ActionRow, Button, type MessageComponentInteraction } from "dressed";
import { story } from "@/story.ts";

export const pattern = "avt-:choice-:vars";

export default function avtButton(interaction: MessageComponentInteraction, args: Params<typeof pattern>) {
  if (interaction.message) interaction.reply = interaction.update;

  let storyPoint = { ...story[args.choice as keyof typeof story] };
  const vars: Record<string, string> = JSON.parse(args.vars);

  if (storyPoint.conditions?.length) {
    for (const condition of storyPoint.conditions) {
      if (
        Object.entries(condition.if).some(([key, value]) => {
          if (/\d\/\d/.test(key)) {
            const [min = 0, max = 0] = key.split("/").map(Number);
            return Math.floor(Math.random() * (max - min + 1)) + min === Number.parseInt(value, 10);
          }
          return vars[key] !== value;
        })
      )
        continue;
      if (condition.join) {
        storyPoint = {
          ...storyPoint,
          ...condition.node,
          choices: (storyPoint.choices ?? []).concat(condition.node.choices ?? []),
          set: { ...storyPoint.set, ...condition.node.set },
        };
      } else storyPoint = { ...storyPoint, ...condition.node };

      if (condition.stop) break;
    }
  }
  if (storyPoint.set) {
    for (const key in storyPoint.set) {
      let value = storyPoint.set[key];
      if (typeof value === "function") value = value(vars);
      if (value) vars[key] = value;
    }
  }
  if (storyPoint.isWin) {
    storyPoint.text = `## You win!\n${storyPoint.text}`;
    storyPoint.choices = undefined;
  } else if (storyPoint.isLose) {
    storyPoint.text = `## Too bad!\n${storyPoint.text}`;
    storyPoint.choices = undefined;
  }

  storyPoint.text = storyPoint.text.replaceAll(/{{ (.+?) }}/g, (_, k) => vars[k] ?? "");

  if (!storyPoint.choices) {
    return interaction.reply({ content: storyPoint.text, ephemeral: true, components: [] });
  }

  return interaction.reply({
    content: storyPoint.text,
    components: [
      ActionRow(
        ...storyPoint.choices.map((choice) =>
          Button({
            custom_id: `avt-${choice}-${JSON.stringify(vars)}`,
            label: story[choice].choice.text,
            emoji: { name: story[choice].choice.emoji },
          }),
        ),
      ),
    ],
    ephemeral: true,
  });
}
