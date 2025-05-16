import createHandler from "@dressed/next";
import { commands, components, events } from "@/../bot.gen";

export const POST = createHandler(commands, components, events);
