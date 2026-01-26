# Blank Bot

This is a blank template bot made with
[Dressed](https://dressed.js.org) using [@dressed/framework](https://npmjs.com/@dressed/framework) that is compatible with Node, Bun, and Deno.

## Commands

- `/ping`: Checks the API latency.

## Setup

1. Clone the project:

   ```sh
   bun create dressed my-bot blank
   cd my-bot
   ```

2. Install dependencies:

   ```sh
   bun install
   ```

3. Register the commands:
   ```sh
   bun register
   ```

In order to obtain a public url to use as the interactions endpoint for Discord,
you need to forward a port, personally, I use VSCode's public port forward
system

If you aren't using VSCode, Cloudflared tunnel is a good option.

You can try editing your bot by modifying `src/commands/ping.ts`.

## Deploying

When you're ready, you can try to deploying the bot. See [the deploying guides](https://dressed.js.org/docs/guide/deploying) for more information.

You can check out
[the GitHub repository](https://github.com/inbestigator/dressed) - your feedback
and contributions are welcome!
