/**
 * Chat API route for the AI SDK `useChat` hook on the client (see `create.tsx`).
 *
 * The app sends the full `UIMessage[]` history; we stream an assistant reply from Vercel AI Gateway (`openai/gpt-4o-mini`). Response is a UI message stream for `@ai-sdk/react` + `DefaultChatTransport` with `expo/fetch`.
 */
import { streamText, UIMessage, convertToModelMessages } from "ai";

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: "openai/gpt-4o-mini",
    messages: await convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse({
    headers: {
      "Content-Type": "application/octet-stream",
      "Content-Encoding": "none",
    },
  });
}
