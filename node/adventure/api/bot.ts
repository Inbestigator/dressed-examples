import { createHandlers, createServer } from "@dressed/dressed/server";
// @ts-ignore Should appear after bundling
import { commandData, componentData, config } from "../dist/bot.gen.js";

const { runCommand, runComponent } = createHandlers(commandData, componentData);
const app = createServer(runCommand, runComponent, config);

export default async (req: Request, res: Response) => {
    await app.ready();
    return app.server.emit("request", req, res);
};
