import createHandler from "@dressed/next";
// @ts-ignore Should appear after bundle
import { commands, components, events } from "../.dressed";

export const POST = createHandler(commands, components, events);
