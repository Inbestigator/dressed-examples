import { copyFileSync, watch } from "node:fs";
import { resolve } from "node:path";
import { crawlDir, parseCommands, parseComponents, parseEvents } from "@dressed/framework/build";
import { createServer } from "dressed/server";
import { config as dressedConfig } from "dressed/utils";
import config from "./dressed.config.tsx";

Object.assign(dressedConfig, config);

const files = await Promise.all(
  ["commands", "components", "events"].map(async (d) =>
    Promise.all(
      (await crawlDir("src", d, config.build?.extensions)).map(async (f) => ({
        ...f,
        exports: await import(resolve(f.path)),
      })),
    ),
  ),
);

createServer(parseCommands(files[0] ?? []), parseComponents(files[1] ?? []), parseEvents(files[2] ?? []));

watch("./src", { recursive: true, persistent: true }, () => copyFileSync("dev.ts", "dev.ts"));
