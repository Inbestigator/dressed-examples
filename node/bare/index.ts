import { type CommandData, createServer, registerCommands } from "dressed/server";

const commands = {
  ping: {
    config: { description: "Checks the API latency" },
    async default(interaction) {
      const start = Date.now();
      const res = await interaction.deferReply({ ephemeral: true, with_response: true });
      const delay = Date.parse(res.resource?.message?.timestamp ?? "") - start;
      await interaction.editReply(`🏓 ${delay}ms`);
    },
  } satisfies CommandData,
};

if (process.env.REGISTER) {
  registerCommands(commands);
} else {
  createServer(commands, {}, {});
}
