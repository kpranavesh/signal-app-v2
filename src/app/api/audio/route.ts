import "server-only";

import { NextResponse } from "next/server";
import { MsEdgeTTS, OUTPUT_FORMAT } from "edge-tts-node";
import { Readable } from "stream";

// Microsoft Edge neural voice — free, no API key.
// Other options: en-US-AriaNeural (female), en-US-JennyNeural, en-GB-RyanNeural
const EDGE_VOICE = "en-US-GuyNeural";

function escapeForSsml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/**
 * POST returns audio bytes using Microsoft Edge TTS only (free, no API key).
 * ElevenLabs backup: see elevenlabs-tts.backup.ts and AUDIO.md to re-enable.
 */
export async function POST(req: Request) {
  const { text } = await req.json();

  if (!text || typeof text !== "string") {
    return NextResponse.json({ error: "text is required." }, { status: 400 });
  }

  const safeText = escapeForSsml(text);
  if (!safeText.trim()) {
    return NextResponse.json({ error: "text is empty after sanitization." }, { status: 400 });
  }

  try {
    const tts = new MsEdgeTTS({});
    await tts.setMetadata(EDGE_VOICE, OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3);
    const readable = tts.toStream(safeText) as Readable;

    const chunks: Buffer[] = [];
    for await (const chunk of readable) {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    }
    const buffer = Buffer.concat(chunks);
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "no-store",
      },
    });
  } catch (e) {
    console.error("Edge TTS error:", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "TTS failed." },
      { status: 500 },
    );
  }
}
