type StoryKey = "start";

interface StoryNode {
  text: string;
  choice: {
    text: string;
    emoji: string;
  };
  isWin?: boolean;
  isLose?: boolean;
  when?: {
    must: Record<string, string>;
    then: Partial<Omit<StoryNode, "when">>;
  }[];
  set?: Record<string, string>;
  choices?: StoryKey[];
}

export const story: Record<StoryKey, StoryNode> = {
  start: {
    choice: {
      text: "Start",
      emoji: "",
    },
    text: "Start text",
    choices: [],
  },
};
