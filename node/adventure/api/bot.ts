import createHandler from "@dressed/next";
// @ts-ignore Should appear after build
import { commands, components, events, config } from "../.dressed/index.mjs";

export const POST = createHandler(commands, components, events, config);
