# @hadidyapp/audio-sdk

Official JavaScript SDK for the [Hadidy Audio](https://hadidy.com) Transcoding API. Runs in browsers and Node.js 22+. Zero runtime dependencies — types are bundled.

## Installation

```bash
npm install @hadidyapp/audio-sdk
```

> **Node.js:** requires v22 or later. **Browser:** any modern browser with `fetch`. No `@types/` package needed — types are included.

## Quick Start — Audio Transcoding

```typescript
import { AudioClient } from '@hadidyapp/audio-sdk';

const client = new AudioClient({ apiKey: 'had_live_...' });

// Upload a file from a browser <input>
const file = document.querySelector<HTMLInputElement>('#upload')!.files![0];
const job = await client.jobs.create(file, { output_format: 'mp3', bitrate: '192k' });

// Poll until transcoding completes
const completed = await client.jobs.waitForCompletion(job.id);
console.log(completed.output_url);
```

## Live Streaming

Full session lifecycle: create → configure encoder → push track metadata → stop.

### WHIP (OBS 30+ / Larix — recommended)

```typescript
const session = await client.live.createSession({
  title: 'Friday Night Show',
  ingest_protocol: 'whip',   // default; can be omitted
  recording_enabled: true,
});
await client.live.startSession(session.id);

// Paste session.ingest_url into OBS 30+: Settings → Stream → WHIP
// No separate stream key field — the key is embedded in the URL.
console.log('WHIP endpoint:', session.ingest_url);
// → https://ingest.hadidy.com/{stream_key}/whip
```

### RTMPS (OBS older / vMix / Streamlabs)

```typescript
const session = await client.live.createSession({
  title: 'Friday Night Show',
  ingest_protocol: 'rtmp',   // externally TLS-encrypted RTMPS on port 4936
});
await client.live.startSession(session.id);

// OBS: Settings → Stream → Custom → Service: Custom RTMPS
console.log('RTMPS server:', session.ingest_url);   // rtmps://rtmps.hadidy.com:4936/
console.log('Stream key:  ', session.stream_key);   // set separately in encoder
```

### Push track metadata mid-stream

```typescript
// Update current track (DJ software can call this on track change)
await client.live.updateNowPlaying(session.id, {
  title: 'Midnight City',
  artist: 'M83',
  cover_url: 'https://example.com/cover.jpg',
  // Preload next track on listeners' devices before the transition:
  next_title: 'Resonance',
  next_artist: 'Home',
  next_cover_url: 'https://example.com/next-cover.jpg',
});

// Clear track info
await client.live.clearNowPlaying(session.id);
```

### Stop and access recordings

```typescript
await client.live.stopSession(session.id);

const recordings = await client.live.listRecordings(session.id);
recordings.forEach(r => console.log(r.download_url, r.duration_seconds));
```

## API Coverage

| Resource | Methods |
|---|---|
| `client.auth` | `me()`, `stats()`, `serviceCosts()` |
| `client.jobs` | `list()`, `listAll()`, `get()`, `create()`, `createV2()`, `reTranscode()`, `delete()`, `getOutput()`, `waitForCompletion()` |
| `client.presets` | `list()`, `listAll()`, `get()`, `create()`, `update()`, `delete()` |
| `client.codecs` | `listCodecs()`, `getCodec()`, `listFormats()`, `getFormat()`, `capabilities()` |
| `client.streaming` | `getToken()`, `getSignedStreamUrl()`, `getSignedDownloadUrl()` |
| `client.analysis` | `analyze()` |
| `client.audio` | `waveformData()`, `silence()`, `getMetadata()`, `updateMetadata()`, `concat()` |
| `client.webhooks` | `list()`, `get()`, `create()`, `update()`, `delete()`, `deliveries()`, `test()` |
| `client.billing` | `balance()`, `history()`, `historyAll()` |
| `client.folders` | `list()`, `get()`, `breadcrumb()`, `create()`, `update()`, `delete()`, `moveFiles()` |
| `client.sharing` | `list()`, `get()`, `create()`, `update()`, `delete()`, `getPublicInfo()`, `verifyPasscode()` |
| `client.live` | `createSession()`, `getSession()`, `listSessions()`, `listSessionsAll()`, `updateSession()`, `startSession()`, `stopSession()`, `restartSession()`, `deleteSession()`, `regenerateKey()`, `updateNowPlaying()`, `clearNowPlaying()`, `listSources()`, `createSource()`, `listParticipants()`, `listRecordings()` |

## Async Iteration

```typescript
// Iterate all completed jobs without manual pagination
for await (const job of client.jobs.listAll({ status: 'completed' })) {
  console.log(job.file_name, job.output_url);
}

// Iterate all live sessions
for await (const session of client.live.listSessionsAll()) {
  console.log(session.title, session.status);
}
```

## Error Handling

```typescript
import { AudioClient, HadidyError, AuthenticationError, RateLimitError, ValidationError } from '@hadidyapp/audio-sdk';

try {
  await client.jobs.get('nonexistent-id');
} catch (err) {
  if (err instanceof AuthenticationError) {
    // 401 — invalid or missing API key
  } else if (err instanceof RateLimitError) {
    console.log(`Rate limited, retry after ${err.retryAfter}ms`);
  } else if (err instanceof ValidationError) {
    console.error('Bad request:', err.message);
  } else if (err instanceof HadidyError) {
    console.error(err.status, err.code, err.message);
  }
}

// Live-specific: starting a session that's already live returns 409
try {
  await client.live.startSession(alreadyLiveSessionId);
} catch (err) {
  if (err instanceof HadidyError && err.status === 409) {
    console.log('Session is already live');
  }
}
```

## Configuration

```typescript
const client = new AudioClient({
  apiKey: 'had_live_...',          // required
  baseUrl: 'https://api.hadidy.com', // default
  timeout: 30_000,                   // ms — default: 30 000
  retries: 2,                        // default: 2
  fetch: customFetch,                // optional: inject custom fetch (e.g. for testing)
});
```

## License

MIT
