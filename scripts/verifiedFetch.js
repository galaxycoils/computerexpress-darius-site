// Retry read-only verification, never submissions or mail delivery.
export async function fetchVerifiedText(url, validate, {
  attempts = 3,
  delayMs = 2000,
  fetchImpl = globalThis.fetch,
  wait = (ms) => new Promise(resolve => setTimeout(resolve, ms)),
} = {}) {
  if (!Number.isInteger(attempts) || attempts < 1) throw new Error('Verification attempts must be a positive integer');
  for (let attempt = 0; attempt < attempts; attempt++) {
    try {
      const response = await fetchImpl(url, { cache: 'no-store', signal: AbortSignal.timeout(15000) });
      if (!response.ok) {
        const error = new Error(`Verification request failed: ${url} (HTTP ${response.status})`);
        error.retryable = response.status === 408 || response.status === 429 || response.status >= 500;
        throw error;
      }
      const text = await response.text();
      if (!validate(text)) throw new Error(`Expected published content missing: ${url}`);
      return text;
    } catch (error) {
      if (error.retryable === false || attempt === attempts - 1) throw error;
      await wait(delayMs);
    }
  }
}
