import { build } from "@dressed/dressed/server";
import { writeFileSync } from "node:fs";

async function genBot() {
  writeFileSync(
    "./bot.gen.ts",
    new TextEncoder().encode(await build(true)),
  );
  console.log("✔ Wrote to bot.gen.ts");
}

genBot();
