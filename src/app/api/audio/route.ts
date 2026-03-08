import "server-only";

import { NextResponse } from "next/server";
import { MsEdgeTTS, OUTPUT_FORMAT } from "edge-tts-node";
import { Readable } from "stream";

// ----- Provider switch: "edge" (default, free) or "elevenlabs" (set AUDIO_TTS_PROVIDER + ELEVENLABS_API_KEY)
const TTS_PROVIDER = process.env.AUDIO_TTS_PROVIDER?.toLowerCase() === "elevenlabs" ? "elevenlabs" : "edge";

// ----- Edge TTS (free, no API key)
const EDGE_VOICE = "en-US-GuyNeural"; // e.g. en-US-AriaNeural (female), en-GB-RyanNeural

function escapeForSsml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

async function synthesizeEdge(text: string): Promise<NextResponse> {
  const safeText = escapeForSsml(text);
  if (!safeText.trim()) {
    return NextResponse.json({ error: "text is empty after sanitization." }, { status: 400 });
  }
  const tts = new MsEdgeTTS({});
  await tts.setMetadata(EDGE_VOICE, OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3);
  const readable = tts.toStream(safeText) as Readable;
  const chunks: Buffer[] = [];
  for await (const chunk of readable) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  const buffer = Buffer.concat(chunks);
  return new NextResponse(buffer, {
    headers: { "Content-Type": "audio/mpeg", "Cache-Control": "no-store" },
  });
}

// ----- ElevenLabs (optional: set AUDIO_TTS_PROVIDER=elevenlabs and ELEVENLABS_API_KEY)
const ELEVENLABS_VOICE_ID = "pNInz6obpgDQGcFmaJgB"; // Adam — Titan-style deep voice

async function synthesizeElevenLabs(apiKey: string, text: string): Promise<NextResponse> {
  const streamUrl = new URL(
    `https://api.elevenlabs.io/v1/text-to-speech/${ELEVENLABS_VOICE_ID}/stream`,
  );
  streamUrl.searchParams.set("optimize_streaming_latency", "3");
  streamUrl.searchParams.set("output_format", "mp3_22050_32");

  const response = await fetch(streamUrl.toString(), {
    method: "POST",
    headers: {
      Accept: "audio/mpeg",
      "Content-Type": "application/json",
      "xi-api-key": apiKey,
    },
    body: JSON.stringify({
      text,
      model_id: "eleven_flash_v2_5",
      voice_settings: { stability: 0.5, similarity_boost: 0.75 },
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    return NextResponse.json(
      { error: `ElevenLabs error: ${body}` },
      { status: response.status },
    );
  }

  const stream = response.body;
  if (!stream) {
    return NextResponse.json({ error: "No stream from ElevenLabs." }, { status: 502 });
  }

  return new NextResponse(stream, {
    headers: { "Content-Type": "audio/mpeg", "Cache-Control": "no-store" },
  });
}

/**
 * POST returns audio bytes. Uses Edge TTS by default (free).
 * To use ElevenLabs: set AUDIO_TTS_PROVIDER=elevenlabs and ELEVENLABS_API_KEY.
 */
export async function POST(req: Request) {
  const { text } = await req.json();

  if (!text || typeof text !== "string") {
    return NextResponse.json({ error: "text is required." }, { status: 400 });
  }

  if (TTS_PROVIDER === "elevenlabs") {
    const apiKey = process.env.ELEVENLABS_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "ELEVENLABS_API_KEY is required when AUDIO_TTS_PROVIDER=elevenlabs." },
        { status: 500 },
      );
    }
    return synthesizeElevenLabs(apiKey, text);
  }

  try {
    return await synthesizeEdge(text);
  } catch (e) {
    console.error("Edge TTS error:", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "TTS failed." },
      { status: 500 },
    );
  }
}
