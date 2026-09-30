// A page returned by a development server is not confirmation of a submission.
export async function submitForm(endpoint, payload, fallbackMessage) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20000);
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    const result = await response.json().catch(() => null);
    if (!response.ok || result?.success !== true) {
      throw new Error(
        typeof result?.error === "string" ? result.error : fallbackMessage,
      );
    }
    return result;
  } catch (error) {
    if (controller.signal.aborted)
      throw new Error(
        "This is taking longer than expected. Your submission may have arrived. Please contact us before trying again.",
      );
    if (error instanceof TypeError)
      throw new Error(
        "Could not connect. Check your connection and try again; your details are still here.",
      );
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}
