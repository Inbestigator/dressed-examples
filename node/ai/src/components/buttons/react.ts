import type { MessageComponentInteraction, ModalSubmitInteraction } from "@dressed/react";
import { createCallbackHandler } from "@dressed/react/callbacks";

export default createCallbackHandler({
  default(interaction: MessageComponentInteraction | ModalSubmitInteraction) {
    return interaction.reply("Couldn't find a handler for that interaction", { ephemeral: true });
  },
});

export { pattern } from "@dressed/react/callbacks";
