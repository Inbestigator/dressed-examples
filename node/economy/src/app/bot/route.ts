import { handleRequest } from "dressed/server";
import { commands, components, events } from "@/../.dressed";

export const POST = (req: Request) => handleRequest(req, commands, components, events);
