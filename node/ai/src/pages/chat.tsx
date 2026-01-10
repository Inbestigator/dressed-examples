import {
  Button,
  Label,
  type ModalSubmitInteraction,
  Section,
  TextDisplay,
  TextInput,
} from "@dressed/react";
import { registerHandler } from "@dressed/react/callbacks";
import { Fragment, type PropsWithChildren } from "react";
import { useChat } from "../hooks/use-chat";

function EmptySection({ children }: PropsWithChildren) {
  return <Section accessory={children}>‎</Section>;
}

const defaultPrompt = { label: "Reply", modal: "Reply to message", empty: "‎" };

export function ChatPage({
  initial,
  prompt = defaultPrompt,
}: {
  initial?: string;
  prompt?: { label: string; modal: string; empty?: string };
}) {
  const { isGenerating, messages, sendMessage } = useChat(initial);
  const firstIndex = Number(!!initial);
  const showPrompt = messages.at(-1)?.parts.length || messages.length < firstIndex + 1;

  return (
    <>
      {messages
        .slice(firstIndex)
        .filter((m) => m.parts.length)
        .map((m) =>
          m.role === "user" ? (
            <EmptySection key={m.id}>
              <Button
                custom_id={m.id}
                label={m.parts[0].type === "text" ? m.parts[0].text : "..."}
                style="Secondary"
                disabled
              />
            </EmptySection>
          ) : (
            <TextDisplay key={m.id}>
              {m.parts.map((p, i) => (
                <Fragment key={`${m.id}-${i}`}>{p.type === "text" && p.text}</Fragment>
              ))}
            </TextDisplay>
          )
        )}
      {messages.length < firstIndex + 1 && prompt.empty}
      {showPrompt && (
        <Section
          accessory={
            <Button
              onClick={(i) => {
                const { custom_id } = registerHandler(
                  `${i.data.custom_id}:modal`,
                  (i: ModalSubmitInteraction) => sendMessage(i.getField("text", true).textInput())
                );
                return i.showModal(
                  <Label label="Content">
                    <TextInput custom_id="text" max_length={80} />
                  </Label>,
                  {
                    custom_id,
                    title: (messages.length > firstIndex ? defaultPrompt : prompt).modal,
                  }
                );
              }}
              label={(messages.length > firstIndex ? defaultPrompt : prompt).label}
              disabled={isGenerating}
            />
          }
        >
          -# *AI can make mistakes. Check important info*
        </Section>
      )}
    </>
  );
}
