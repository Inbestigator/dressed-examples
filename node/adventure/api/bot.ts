import { createHandlers, handleRequest } from "@dressed/dressed/server";
// @ts-ignore Should appear after bundle
import { commandData, componentData } from "../dist/bot.gen.js";

const { runCommand, runComponent } = createHandlers(commandData, componentData);

export async function POST(
    req: Request,
    res: { waitUntil: (p: unknown) => void },
) {
    return handleRequest(
        {
            headers: {
                "x-signature-ed25519": req.headers.get("x-signature-ed25519"),
                "x-signature-timestamp": req.headers.get(
                    "x-signature-timestamp",
                ),
            },
            text: await req.text(),
        },
        (i) => res.waitUntil(runCommand(i)),
        (i) => res.waitUntil(runComponent(i)),
    );
}
