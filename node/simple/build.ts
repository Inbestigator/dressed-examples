import { build } from "@dressed/dressed/server";
import { writeFileSync } from "node:fs";

async function genBot() {
  const outputContent = await build(true, false);
  const nodeServer = outputContent
    .replace(
      /server";\n/,
      '$&import { createServer } from "./server.ts";\n',
    )
    .replace(
      /console.warn\(.+\)/,
      "createServer(runCommand, runComponent, config)",
    );
  writeFileSync("./bot.gen.ts", new TextEncoder().encode(nodeServer));
  console.log("✔ Wrote to bot.gen.ts");
}

genBot();
