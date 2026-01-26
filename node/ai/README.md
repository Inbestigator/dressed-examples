# AI Chatbot

This is a simple AI bot made with [Dressed](https://dressed.js.org) that is
compatible with Node, Bun, and Deno.

By default it uses [Groq](https://groq.com) as the AI provider, but you can easily change that in `dressed.config.ts`.

## Commands

- `Summarize`: Message context command to summarize the contents of the message.
- `chat`: Message the AI bot.

## Setup

1. Clone the project:

   ```sh
   bun create dressed my-bot ai
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

You can try editing your bot by modifying `src/commands/chat.ts`.

## Deploying

When you're ready, you can try to deploying the bot. Be aware that this bot
utilizes [hooks and callback interactions](https://dressed.js.org/docs/react),
which means that it likely will not work well in a serverless environment as-is.
See [the deploying guides](https://dressed.js.org/docs/guide/deploying) for more
information.

You can check out
[the GitHub repository](https://github.com/inbestigator/dressed) - your feedback
and contributions are welcome!
