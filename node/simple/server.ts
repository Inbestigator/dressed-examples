import { BotConfig } from "@dressed/dressed";
import {
  CommandHandler,
  ComponentHandler,
  runInteraction,
  verifySignature,
} from "@dressed/dressed/server";
import express from "express";

export function createServer(
  runCommand: CommandHandler,
  runComponent: ComponentHandler,
  config: BotConfig,
) {
  const app = express();
  app.use(express.json());
  const port = 8000;

  app.post(config.endpoint ?? "/", async (req, res) => {
    const maskedReq = {
      headers: {
        get: (name: string) => {
          return req.headers[name.toLowerCase()];
        },
      },
      text: () => JSON.stringify(req.body),
      json: () => req.body,
    };

    if (!(await verifySignature(maskedReq as unknown as Request))) {
      console.error(" └ Invalid signature");
      res.send(null).status(401);
      return;
    }

    try {
      const response = await runInteraction(
        runCommand,
        runComponent,
        maskedReq as unknown as Request,
      );

      const { status } = response;
      if (status === 200) {
        res.json({ type: 1 });
      }
      res.status(status);
    } catch (error) {
      console.error(" └ Error processing request:", error);
      res.status(500).send("Internal Server Error");
    }
  });

  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
}
