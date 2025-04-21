import {
    handleRequest,
    setupCommands,
    setupComponents,
} from "@dressed/dressed/server";
import { commandData, componentData } from "@/../bot.gen";
import { waitUntil } from "@vercel/functions";

export async function POST(req: Request) {
    const [runCommand, runComponent] = [
        setupCommands(commandData),
        setupComponents(componentData),
    ] as ((i: unknown) => Promise<void>)[];
    return handleRequest(
        req,
        (i) => waitUntil(runCommand(i)),
        (i) => waitUntil(runComponent(i)),
    );
}
