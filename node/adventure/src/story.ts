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
    then: Partial<Omit<StoryNode, "conditions">>;
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
    choice: {
      text: "Start",
      emoji: "✅",
    },
    text: "Choose your fighter!",
    set: {
      health: "5",
      enemyHealth: "5",
    },
    choices: ["pickandchew", "charhazard"],
  },
  pickandchew: {
    choice: {
      text: "Pickandchew",
      emoji: "⚡",
    },
    text: "You picked Pickandchew! Lightning is your best weapon!",
    set: {
      fighter: "pick",
    },
    choices: ["attack"],
  },
  charhazard: {
    choice: {
      text: "Charhazard",
      emoji: "🔥",
    },
    text: "You picked Charhazard! Fire is your element!",
    set: {
      fighter: "char",
    },
    choices: ["attack"],
  },
  attack: {
    choice: {
      text: "Attack",
      emoji: "⚔️",
    },
    text:
      "**Your health**: {{ health }} **Enemy health**: {{ enemyHealth }}\n\nChoose your attack!",
    conditions: [
      {
        if: { fighter: "pick" },
        then: {
          choices: ["attackThunder", "attackStrike", "healShock"],
        },
      },
      {
        if: { fighter: "char" },
        then: {
          choices: ["attackFlame", "attackSwipe", "healSoar"],
        },
      },
    ],
  },
  attackThunder: {
    choice: {
      text: "Thunderzap",
      emoji: "⚡",
    },
    text:
      "**Your health**: {{ health }} **Enemy health**: {{ enemyHealth }}\nYou chose the Thunderzap attack!",
    set: {
      attack: "thunder",
      enemyHealth: (v) => (parseInt(v.enemyHealth) - 1).toString(),
    },
    conditions: [
      {
        if: { enemyHealth: "1" },
        then: {
          set: { enemyHealth: "0" },
          choices: ["win"],
        },
        stop: true,
      },
    ],
    choices: ["defend"],
  },
  attackStrike: {
    choice: {
      text: "Speedy Strike",
      emoji: "🔥",
    },
    text:
      "**Your health**: {{ health }} **Enemy health**: {{ enemyHealth }}\nYou chose the Speedy Strike attack!",
    set: {
      attack: "strike",
      enemyHealth: (v) => (parseInt(v.enemyHealth) - 2).toString(),
    },
    conditions: [
      {
        if: { enemyHealth: "1" },
        then: {
          set: { enemyHealth: "0" },
          choices: ["win"],
        },
        stop: true,
      },
      {
        if: { enemyHealth: "2" },
        then: {
          set: { enemyHealth: "0" },
          choices: ["win"],
        },
        stop: true,
      },
    ],
    choices: ["defend"],
  },
  healShock: {
    choice: {
      text: "Stunning Heal",
      emoji: "❤️‍🩹",
    },
    text:
      "**Your health**: {{ health }} **Enemy health**: {{ enemyHealth }}\nYou stunned the enemy and healed!",
    set: {
      attack: "shock",
      health: (v) =>
        v.health !== "5" ? (parseInt(v.health) + 1).toString() : v.health,
    },
    choices: ["defend"],
  },
  attackFlame: {
    choice: {
      text: "Flareblast",
      emoji: "🔥",
    },
    text:
      "**Your health**: {{ health }} **Enemy health**: {{ enemyHealth }}\nYou chose the Flareblast attack!",
    set: {
      attack: "flame",
      enemyHealth: (v) => (parseInt(v.enemyHealth) - 1).toString(),
    },
    conditions: [
      {
        if: { enemyHealth: "1" },
        then: {
          set: { enemyHealth: "0" },
          choices: ["win"],
        },
        stop: true,
      },
    ],
    choices: ["defend"],
  },
  healSoar: {
    choice: {
      text: "Soaring Heal",
      emoji: "❤️‍🩹",
    },
    text:
      "**Your health**: {{ health }} **Enemy health**: {{ enemyHealth }}\nYou chose to fly into the air and heal!",
    set: {
      attack: "soar",
      health: (v) =>
        v.health !== "5" ? (parseInt(v.health) + 1).toString() : v.health,
    },
    choices: ["defend"],
  },
  attackSwipe: {
    choice: {
      text: "Dragon Swipe",
      emoji: "🐉",
    },
    text:
      "**Your health**: {{ health }} **Enemy health**: {{ enemyHealth }}\nYou chose the Dragon Swipe attack!",
    set: {
      attack: "swipe",
      enemyHealth: (v) => (parseInt(v.enemyHealth) - 2).toString(),
    },
    conditions: [
      {
        if: { enemyHealth: "1" },
        then: {
          set: { enemyHealth: "0" },
          choices: ["win"],
        },
        stop: true,
      },
      {
        if: { enemyHealth: "2" },
        then: {
          set: { enemyHealth: "0" },
          choices: ["win"],
        },
        stop: true,
      },
    ],
    choices: ["defend"],
  },
  defend: {
    choice: {
      text: "Enemy turn",
      emoji: "⚔️",
    },
    text:
      "**Your health**: {{ health }} **Enemy health**: {{ enemyHealth }}\nThe enemy chose {{ enemyAttack }}\n\nChoose your attack!",
    set: {
      enemyAttack: "Hydrobomb",
      health: (v) => {
        const damage = Math.floor(Math.random() * 2) + 1;
        if ((parseInt(v.health) - damage) <= 0) {
          return "1";
        }
        return (parseInt(v.health) - damage).toString();
      },
    },
    conditions: [
      {
        if: { attack: "thunder" },
        then: {
          choices: ["attackStrike", "healShock"],
        },
      },
      {
        if: { attack: "strike" },
        then: {
          choices: ["attackThunder", "healShock"],
        },
      },
      {
        if: { attack: "shock" },
        then: {
          choices: ["attackThunder", "attackStrike"],
        },
      },
      {
        if: { attack: "flame" },
        then: {
          choices: ["attackSwipe", "healSoar"],
        },
      },
      {
        if: { attack: "soar" },
        then: {
          choices: ["attackFlame", "attackSwipe"],
        },
      },
      {
        if: { attack: "swipe" },
        then: {
          choices: ["attackFlame", "healSoar"],
        },
      },
      {
        if: { health: "1" },
        then: {
          set: {
            health: "0",
          },
          text:
            "**Your health**: {{ health }} **Enemy health**: {{ enemyHealth }}\nThe enemy chose {{ enemyattack }}",
          choices: ["lose"],
        },
        stop: true,
      },
      {
        if: {
          "1/3": "1",
        },
        then: {
          set: {
            enemyHealth: (v) =>
              v.enemyHealth !== "5"
                ? (parseInt(v.enemyHealth) + 1).toString()
                : v.enemyHealth,
          },
        },
      },
    ],
  },
  lose: {
    choice: {
      text: "You lost",
      emoji: "😔",
    },
    text: "You lost the game!",
    isLose: true,
  },
  win: {
    choice: {
      text: "You win",
      emoji: "🎉",
    },
    text: "You won the game!",
    isWin: true,
  },
};
