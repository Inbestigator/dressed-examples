import { randomUUID } from "node:crypto";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { useCallback, useEffect, useState } from "react";
import { languageModel } from "../../dressed.config";

export function useChat(initial?: string) {
  const [messages, setMessages] = useState<UIMessage[]>([]);
  const [isGenerating, setIsGenerating] = useState(!!initial);
  const [hasSentInitial, setHasSentInitial] = useState(false);

  const sendMessage = useCallback(
    async (text: string, role: "user" | "system" = "user") => {
      setIsGenerating(true);
      try {
        const userMessage: UIMessage = {
          id: randomUUID(),
          role,
          parts: [{ type: "text", text }],
        };

        setMessages((p) => [...p, userMessage, { id: randomUUID(), role: "assistant", parts: [] }]);

        const result = streamText({
          model: languageModel,
          messages: await convertToModelMessages([...messages, userMessage]),
        });

        for await (const text of result.textStream) {
          setMessages((prev) => {
            const updated = [...prev];
            const last = updated.at(-1);

            if (last?.role === "assistant") {
              last.parts = [...last.parts, { type: "text", text }];
            }

            return updated;
          });
        }
      } finally {
        setIsGenerating(false);
      }
    },
    [messages]
  );

  useEffect(() => {
    if (initial && !hasSentInitial) {
      setHasSentInitial(true);
      sendMessage(initial, "system");
    }
  }, [initial, hasSentInitial, sendMessage]);

  return { isGenerating, messages: trimMessages(messages), sendMessage };
}

function trimMessages(messages: UIMessage[]) {
  let assistantChars = 0;

  for (const p of messages.flatMap((m) => (m.role === "assistant" ? m.parts : []))) {
    if (p.type === "text") {
      assistantChars += p.text.length;
    }
  }

  const trimmed = [...messages];

  // This should approximately start cutting off messages as we get closer to the character/component limits
  while (assistantChars > 3750 || trimmed.length > 18) {
    const idx = trimmed.findIndex((m) => m.role !== "system");

    if (idx === -1) break;

    const removed = trimmed.splice(idx, 1)[0];

    if (removed.role === "assistant") {
      for (const p of removed.parts) {
        if (p.type === "text") assistantChars -= p.text.length;
      }
    }
  }

  return trimmed;
}
