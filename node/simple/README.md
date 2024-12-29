# Simple (non-Deno) Bot

This is a version of the simple example bot made with
[Dressed](https://jsr.io/@inbestigator/dressed) that is compatible with Node,
Bun, and Deno.

## Commands

- `/counter`: Increments a counter.
- `/greet`: Returns a greeting.
- `/trivia`: Gives a random trivia question.

## Getting Started

First, build the bot:

```sh
pnpm install
pnpm register
```

Then start the bot in development mode:

```sh
pnpm dev
```

The custom `build.ts` script _should_ automatically fix the `bot.gen.ts` output
to use the simple Express solution for Node in `server.ts`.

In order to obtain a public url to use as the interactions endpoint for Discord,
you need to forward a port, personally, I use VSCode's public port forward
system

If you aren't using VSCode, Cloudflared tunnel is a good option.

You can try editing your bot by modifying `src/commands/greet.ts`.

## Deploying

When you're ready, you can try to deploy the bot with Deno deploy:

```sh
pnpm build
deployctl deploy --entrypoint=bot.gen.ts
```

You can check out
[the GitHub repository](https://github.com/inbestigator/dressed) - your feedback
and contributions are welcome!
