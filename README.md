# @hadidyapp/audio-sdk

Official JavaScript SDK for the [Hadidy Audio](https://hadidy.com) Transcoding API. Runs in browsers and Node.js 22+. Zero runtime dependencies.

## Installation

```bash
npm install @hadidyapp/audio-sdk
```

## Quick Start

```typescript
import { AudioClient } from '@hadidyapp/audio-sdk';

const client = new AudioClient({ apiKey: 'had_live_...' });

// Upload a file from a browser input
const file = document.querySelector<HTMLInputElement>('#upload')!.files![0];
const job = await client.jobs.create(file, { output_format: 'mp3', bitrate: '192k' });

// Poll until done
const completed = await client.jobs.waitForCompletion(job.id);
console.log(completed.output_url);
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
| `client.live` | Full session CRUD, start/stop/restart, now-playing, sources, participants, recordings |

## Async Iteration

```typescript
for await (const job of client.jobs.listAll({ status: 'completed' })) {
  console.log(job.file_name, job.output_url);
}
```

## Error Handling

```typescript
import { AuthError, RateLimitError, HadidyError } from '@hadidyapp/audio-sdk';

try {
  await client.jobs.get('nonexistent-id');
} catch (err) {
  if (err instanceof RateLimitError) {
    console.log(`Retry after ${err.retryAfter}ms`);
  } else if (err instanceof HadidyError) {
    console.error(err.status, err.code, err.message);
  }
}
```

## Configuration

```typescript
const client = new AudioClient({
  apiKey: 'had_live_...',
  baseUrl: 'https://api.hadidy.com',  // default
  timeout: 30_000,                     // default: 30s
  retries: 2,                          // default: 2
  fetch: customFetch,                  // optional: inject custom fetch
});
```

## License

MIT
