type StoryKey =
  | "start"
  | "pickandchew"
  | "charhazard"
  | "attack"
  | "attackThunder"
  | "attackStrike"
  | "healShock"
  | "attackFlame"
  | "attackSwipe"
  | "healSoar"
  | "defend"
  | "win"
  | "lose";

interface StoryNode {
  /** The text to display when the user selects that choice */
  text: string;
  /** Details for when showing the options */
  choice: {
    /** The name of the choice */
    text: string;
    /** An emojis associated with it */
    emoji: string;
  };
  /** End the game with this final text and declare a win */
  isWin?: boolean;
  /** End the game with this final text and declare a lose */
  isLose?: boolean;
  /** Allow variables to change the node */
  conditions?: {
    /** Key/values for what certain variables must be to change the node */
    if: Record<string, string>;
    /** New data that will partially overwrite the node */
    node: Partial<Omit<StoryNode, "conditions">>;
    /** Join with previous node instead of overwriting */
    join?: boolean;
    /** Stop checking conditions after this one */
    stop?: boolean;
  }[];
  /** Set variables */
  set?: Record<string, string | ((vars: Record<string, string>) => string)>;
  /** String names of the choices
   * @example ["start", "end"]
   */
  choices?: StoryKey[];
}

export const story: Record<StoryKey, StoryNode> = {
  start: {
    choice: { text: "Start", emoji: "✅" },
    text: "Choose your fighter!",
    set: { h: "5", eh: "5" },
    choices: ["pickandchew", "charhazard"],
  },
  pickandchew: {
    choice: { text: "Pickandchew", emoji: "⚡" },
    text: "You picked Pickandchew! Lightning is your best weapon!",
    set: { f: "pick" },
    choices: ["attack"],
  },
  charhazard: {
    choice: { text: "Charhazard", emoji: "🔥" },
    text: "You picked Charhazard! Fire is your element!",
    set: { f: "char" },
    choices: ["attack"],
  },
  attack: {
    choice: { text: "Attack", emoji: "⚔️" },
    text: "**Your health**: {{ h }} **Enemy health**: {{ eh }}\n\nChoose your attack!",
    conditions: [
      { if: { f: "pick" }, node: { choices: ["attackThunder", "attackStrike", "healShock"] } },
      { if: { f: "char" }, node: { choices: ["attackFlame", "attackSwipe", "healSoar"] } },
    ],
  },
  attackThunder: {
    choice: { text: "Thunderzap", emoji: "⚡" },
    text: "**Your health**: {{ h }} **Enemy health**: {{ eh }}\nYou chose the Thunderzap attack!",
    set: { a: "thunder", eh: (v) => (parseInt(v.eh ?? "0", 10) - 1).toString() },
    conditions: [{ if: { eh: "1" }, node: { set: { eh: "0" }, choices: ["win"] }, stop: true }],
    choices: ["defend"],
  },
  attackStrike: {
    choice: { text: "Speedy Strike", emoji: "🔥" },
    text: "**Your health**: {{ h }} **Enemy health**: {{ eh }}\nYou chose the Speedy Strike attack!",
    set: { a: "strike", eh: (v) => (parseInt(v.eh ?? "0", 10) - 2).toString() },
    conditions: [
      { if: { eh: "1" }, node: { set: { eh: "0" }, choices: ["win"] }, stop: true },
      { if: { eh: "2" }, node: { set: { eh: "0" }, choices: ["win"] }, stop: true },
    ],
    choices: ["defend"],
  },
  healShock: {
    choice: { text: "Stunning Heal", emoji: "❤️‍🩹" },
    text: "**Your health**: {{ h }} **Enemy health**: {{ eh }}\nYou stunned the enemy and healed!",
    set: { a: "shock", h: (v) => (v.h !== "5" ? (parseInt(v.h ?? "0", 10) + 1).toString() : v.h) },
    choices: ["defend"],
  },
  attackFlame: {
    choice: { text: "Flareblast", emoji: "🔥" },
    text: "**Your health**: {{ h }} **Enemy health**: {{ eh }}\nYou chose the Flareblast attack!",
    set: { a: "flame", eh: (v) => (parseInt(v.eh ?? "0", 10) - 1).toString() },
    conditions: [{ if: { eh: "1" }, node: { set: { eh: "0" }, choices: ["win"] }, stop: true }],
    choices: ["defend"],
  },
  healSoar: {
    choice: { text: "Soaring Heal", emoji: "❤️‍🩹" },
    text: "**Your health**: {{ h }} **Enemy health**: {{ eh }}\nYou chose to fly into the air and heal!",
    set: { a: "soar", h: (v) => (v.h !== "5" ? (parseInt(v.h ?? "0", 10) + 1).toString() : v.h) },
    choices: ["defend"],
  },
  attackSwipe: {
    choice: { text: "Dragon Swipe", emoji: "🐉" },
    text: "**Your health**: {{ h }} **Enemy health**: {{ eh }}\nYou chose the Dragon Swipe attack!",
    set: { a: "swipe", eh: (v) => (parseInt(v.eh ?? "0", 10) - 2).toString() },
    conditions: [
      { if: { eh: "1" }, node: { set: { eh: "0" }, choices: ["win"] }, stop: true },
      { if: { eh: "2" }, node: { set: { eh: "0" }, choices: ["win"] }, stop: true },
    ],
    choices: ["defend"],
  },
  defend: {
    choice: { text: "Enemy turn", emoji: "⚔️" },
    text: "**Your health**: {{ h }} **Enemy health**: {{ eh }}\nThe enemy chose {{ ea }}\n\nChoose your attack!",
    set: {
      ea: "Hydrobomb",
      h: (v) => Math.max(1, parseInt(v.h ?? "0", 10) - Math.floor(Math.random() * 2) - 1).toString(),
    },
    conditions: [
      { if: { a: "thunder" }, node: { choices: ["attackStrike", "healShock"] } },
      { if: { a: "strike" }, node: { choices: ["attackThunder", "healShock"] } },
      { if: { a: "shock" }, node: { choices: ["attackThunder", "attackStrike"] } },
      { if: { a: "flame" }, node: { choices: ["attackSwipe", "healSoar"] } },
      { if: { a: "soar" }, node: { choices: ["attackFlame", "attackSwipe"] } },
      { if: { a: "swipe" }, node: { choices: ["attackFlame", "healSoar"] } },
      {
        if: { h: "1" },
        node: {
          set: { h: "0" },
          text: "**Your health**: {{ h }} **Enemy health**: {{ eh }}\nThe enemy chose {{ ea }}",
          choices: ["lose"],
        },
        stop: true,
      },
      {
        if: { "1/3": "1" },
        node: {
          set: { eh: (v) => (v.eh !== "5" ? (parseInt(v.eh ?? "0", 10) + 1).toString() : v.eh) },
        },
      },
    ],
  },
  lose: { choice: { text: "You lost", emoji: "😔" }, text: "You lost the game!", isLose: true },
  win: { choice: { text: "You win", emoji: "🎉" }, text: "You won the game!", isWin: true },
};
