export type UploadSource =
  | File
  | Blob
  | ArrayBuffer
  | Uint8Array
  | ReadableStream<Uint8Array>;

export interface UploadOptions {
  filename?: string;
  contentType?: string;
}

export function buildUploadFormData(
  file: UploadSource,
  fieldName: string,
  opts: UploadOptions = {},
  extraFields: Record<string, string> = {},
): FormData {
  const form = new FormData();

  const filename = opts.filename ?? 'upload';
  const contentType = opts.contentType ?? guessMimeType(filename);

  if (file instanceof File) {
    form.append(fieldName, file, file.name);
  } else if (file instanceof Blob) {
    form.append(fieldName, file, filename);
  } else if (file instanceof ArrayBuffer || file instanceof Uint8Array) {
    const bytes = file instanceof Uint8Array ? file : new Uint8Array(file);
    const blob = new Blob([bytes], { type: contentType });
    form.append(fieldName, blob, filename);
  } else {
    throw new TypeError('ReadableStream uploads are not supported in browser FormData. Convert to Blob first.');
  }

  for (const [key, value] of Object.entries(extraFields)) {
    form.append(key, value);
  }

  return form;
}

export function guessMimeType(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase() ?? '';
  const map: Record<string, string> = {
    mp3: 'audio/mpeg',
    wav: 'audio/wav',
    aac: 'audio/aac',
    ogg: 'audio/ogg',
    opus: 'audio/opus',
    flac: 'audio/flac',
    m4a: 'audio/mp4',
    wma: 'audio/x-ms-wma',
    mp2: 'audio/mpeg',
    ac3: 'audio/ac3',
    eac3: 'audio/eac3',
  };
  return map[ext] ?? 'application/octet-stream';
}
