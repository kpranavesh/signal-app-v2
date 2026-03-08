# Audio overview (TTS) config

The “Listen to your briefing” feature can use either **Edge TTS** (default) or **ElevenLabs**.

## Default: Edge TTS

- **Free**, no API key, no credits.
- Uses Microsoft Edge neural voices (e.g. `en-US-GuyNeural`).
- Config lives in `src/app/api/audio/route.ts`: `EDGE_VOICE`, `synthesizeEdge()`.

## Optional: ElevenLabs

To switch to ElevenLabs (e.g. for higher quality or a specific voice):

1. Set environment variables:
   - `AUDIO_TTS_PROVIDER=elevenlabs`
   - `ELEVENLABS_API_KEY=sk_...` (from [ElevenLabs API keys](https://elevenlabs.io/app/settings/api-keys))
2. Restart the dev server or redeploy (Vercel reads env at build/start).

ElevenLabs config in code (so you can switch back anytime):

- **Voice**: `ELEVENLABS_VOICE_ID = "pNInz6obpgDQGcFmaJgB"` (Adam — Titan-style).
- **Model**: `eleven_flash_v2_5`, streaming with `optimize_streaming_latency=3`.
- **Logic**: `synthesizeElevenLabs()` in `src/app/api/audio/route.ts`.

If `AUDIO_TTS_PROVIDER` is unset or not `elevenlabs`, Edge TTS is used.
