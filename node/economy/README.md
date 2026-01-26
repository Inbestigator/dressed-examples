# Economy Bot

This bot is intended as an example of the functionality for
[Dressed](https://dressed.js.org). Users can register, check their balance,
claim daily rewards, view the shop, and buy items.

This bot has an admin dashboard made using Next.js, where you can moderate user
balances and shop items.

## Commands

- `/register`: Register yourself in the economy system.
- `/balance`: View your balance and items.
- `/daily`: Claim your daily reward.
- `/shop`: View the shop and buy items.
- `/leaderboard`: View the top 3 richest users.

## Setup

1. Clone the project:

   ```sh
   bun create dressed my-bot economy
   ```

2. Install dependencies:

   ```sh
   bun install
   ```

3. Register the commands:
   ```sh
   bun register
   ```

## Getting Started

First, run the development bot:

```sh
bun dev
```

In order to obtain a public url to use as the interactions endpoint for Discord,
you need to forward a port, personally, I use VSCode's public port forward
system

If you aren't using VSCode, Cloudflared is a good cli option.

```sh
bunx cloudflared tunnel --url=localhost:3000
```

You can try editing your bot by modifying `src/bot/commands/shop.ts`.

## Deploying

When you're ready, you can try to deploying the bot. See
[the deploying guides](https://dressed.js.org/docs/guide/deploying) for more
information. This bot works especially well on
[Vercel](https://dressed.js.org/docs/guide/deploying/vercel).

You can check out
[the GitHub repository](https://github.com/inbestigator/dressed) - your feedback
and contributions are welcome!
