import createHandler from "@dressed/next";
// @ts-ignore Should appear after bundle
import { commands, components, events } from "../dist/bot.gen.js";

export const POST = createHandler(commands, components, events);
