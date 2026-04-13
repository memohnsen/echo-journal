/**
 * Speech-to-text for recorded journal audio. The client uploads the local file via
 * `multipart/form-data` field `audio` (see `create.tsx`); processing runs here in Node,
 * not in the React Native runtime.
 *
 * Returns JSON `{ text: string }` for the transcript.
 *
 * We call OpenAI's Transcriptions API with `fetch` instead of the AI SDK's `transcribe()`
 * helper: that helper byte-sniffs the audio and defaults mis-detected files to
 * `audio/wav`. Expo records AAC in an MP4/M4A container (`ftyp` at offset 4), so sniffing
 * often fails and Whisper receives a `.wav` label with M4A bytes → "Invalid file format".
 * Sending an explicit `audio/mp4` blob named `recording.m4a` fixes it.
 *
 * Requires `OPENAI_API_KEY` (Whisper on your OpenAI account; separate from
 * `AI_GATEWAY_API_KEY` used for chat).
 */
export async function POST(req: Request) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return Response.json(
      {
        error:
          "OPENAI_API_KEY is not set. Add it to .env for Whisper transcription (OpenAI API).",
      },
      { status: 500 },
    );
  }

  const incoming = await req.formData();
  const file = incoming.get("audio");

  if (!file || typeof file === "string" || !(file instanceof Blob)) {
    return Response.json({ error: "Missing audio file" }, { status: 400 });
  }

  const audio = new Uint8Array(await file.arrayBuffer());

  const outbound = new FormData();
  outbound.append(
    "file",
    new Blob([audio], { type: "audio/mp4" }),
    "recording.m4a",
  );
  outbound.append("model", "whisper-1");

  const res = await fetch("https://api.openai.com/v1/audio/transcriptions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
    body: outbound,
  });

  const raw = await res.text();
  if (!res.ok) {
    return Response.json(
      { error: raw || res.statusText },
      { status: res.status },
    );
  }

  const data = JSON.parse(raw) as { text?: string };
  return Response.json({ text: data.text ?? "" });
}
