# Simple Bot

This is a simple example bot made with
[Dressed](https://jsr.io/@dressed/dressed).

## Commands

- `/counter`: Increments a counter.
- `/greet`: Returns a greeting.
- `/minesweeper`: Play a game of minesweeper.
- `/trivia`: Gives a random trivia question.

## Setup

1. Clone the project:
   ```sh
   deno -A jsr:@dressed/cmd create my-bot deno/economy
   ```

2. Install dependencies:
   ```sh
   deno install
   ```

3. Register the commands:
   ```sh
   deno task register
   ```

## Getting Started

First, run the development bot:

```sh
deno task dev
```

In order to obtain a public url to use as the interactions endpoint for Discord,
you need to forward a port, personally, I use VSCode's public port forward
system

If you aren't using VSCode, Cloudflared is a good cli option.

```sh
deno -A npm:cloudflared tunnel --url=localhost:8000
```

You can try editing your bot by modifying `src/commands/shop.ts`.

## Deploying

When you're ready, you can deploy the bot with Deno deploy:

```sh
deno task build
deployctl deploy --entrypoint=bot.gen.ts
```

You can check out
[the GitHub repository](https://github.com/inbestigator/dressed) - your feedback
and contributions are welcome!
