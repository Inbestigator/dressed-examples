import {
    handleRequest,
    setupCommands,
    setupComponents,
} from "@dressed/dressed/server";
// @ts-ignore Should appear after bundle
import { commandData, componentData } from "../dist/bot.gen.js";

export async function POST(
    req: Request,
    res: { waitUntil: (c: unknown) => void },
) {
    const [runCommand, runComponent] = [
        setupCommands(commandData),
        setupComponents(componentData),
    ];
    return handleRequest(
        req,
        (i) => res.waitUntil(runCommand(i)),
        (i) => res.waitUntil(runComponent(i)),
    );
}
