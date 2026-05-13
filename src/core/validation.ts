const UNSAFE_ID_PATTERN = /[/\\.\x00-\x1f]|^\.\./;

export function validateId(id: string, name = 'id'): string {
  if (!id || typeof id !== 'string') {
    throw new TypeError(`${name} must be a non-empty string`);
  }
  if (UNSAFE_ID_PATTERN.test(id) || id.includes('..')) {
    throw new TypeError(
      `Invalid ${name}: must not contain path separators, traversal sequences, or control characters`,
    );
  }
  return encodeURIComponent(id);
}

const API_KEY_PREFIX_PATTERN = /^had_(live|test|dev)_/;

export function validateApiKey(apiKey: string): void {
  if (!apiKey || typeof apiKey !== 'string' || !apiKey.trim()) {
    throw new TypeError('apiKey must be a non-empty string');
  }
}
