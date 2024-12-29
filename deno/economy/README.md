# Economy HTTP Discord Bot

This bot is intended as an example of the functionality for
[Dressed](https://dressed.vercel.app). Users can register, check their balance,
claim daily rewards, view the shop, and buy items.

## Commands

- `/register`: Register yourself in the economy system.
- `/balance`: View your balance and items.
- `/daily`: Claim your daily reward.
- `/shop`: View the shop and buy items.
- `/leaderboard`: View the top 3 richest users.

## Setup

1. Clone the project

2. Install dependencies:
   ```sh
   deno install
   ```

3. Create a `.env` file and add your Discord bot token, app ID, and public key:
   ```env
   DISCORD_TOKEN="your_discord_token"
   DISCORD_APP_ID="your_app_id"
   DISCORD_PUBLIC_KEY="your_public_key"
   ```

4. Register the commands:
   ```sh
   deno task register
   ```

5. Start the bot in dev mode:
   ```sh
   deno task dev
   ```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

This project is licensed under the MIT License.
