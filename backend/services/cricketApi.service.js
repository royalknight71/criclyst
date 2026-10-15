const CRICAPI_BASE_URL = "https://api.cricapi.com/v1";
const REQUEST_TIMEOUT_MS = 10000;

function getApiKey() {
  // Trimmed once so stray whitespace (common in hand-edited .env values)
  // can never produce a bogus "Invalid API Key". Never logged.
  const key = (process.env.CRICKET_API_KEY || "").trim();
  if (!key) {
    throw new Error("CRICKET_API_KEY is not configured");
  }
  return key;
}

/**
 * Defensive scrub: guarantee the API key can never appear in an error
 * message (logs, API responses, status events) even if the provider
 * echoes it back inside `reason`/`message`.
 */
function scrubSecret(message) {
  if (typeof message !== "string" || !message) return message;
  const key = (process.env.CRICKET_API_KEY || "").trim();
  return key ? message.split(key).join("***") : message;
}

/**
 * CricAPI echoes the requested apikey back inside its response body.
 * Delete it so the credential can never leak through our own API
 * responses (e.g. /api/live-cricket/latest returns the raw payload).
 * Applied before ANY branch so failure payloads are scrubbed too.
 */
function sanitizeProviderPayload(data) {
  if (data && typeof data === "object" && "apikey" in data) {
    delete data.apikey;
  }
  return data;
}

export async function fetchCurrentMatches() {
  const apiKey = getApiKey();
  const url = `${CRICAPI_BASE_URL}/currentMatches?apikey=${encodeURIComponent(apiKey)}&offset=0`;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(url, { signal: controller.signal });

    if (!response.ok) {
      throw new Error(`CricAPI responded with status ${response.status}`);
    }

    const data = sanitizeProviderPayload(await response.json());

    if (data.status !== "success") {
      const msg = data.reason || data.message || "Unknown error from CricAPI";
      throw new Error(`CricAPI error: ${scrubSecret(msg)}`);
    }

    return data;
  } catch (error) {
    if (error.name === "AbortError") {
      throw new Error("CricAPI request timed out", { cause: error });
    }
    throw new Error(scrubSecret(error.message), { cause: error });
  } finally {
    clearTimeout(timeout);
  }
}

export async function fetchMatchScorecard(matchId) {
  const apiKey = getApiKey();
  const url = `${CRICAPI_BASE_URL}/match_scorecard?apikey=${encodeURIComponent(apiKey)}&id=${encodeURIComponent(matchId)}`;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(url, { signal: controller.signal });

    if (!response.ok) {
      throw new Error(`CricAPI responded with status ${response.status}`);
    }

    const data = sanitizeProviderPayload(await response.json());

    if (data.status !== "success") {
      const msg = data.reason || data.message || "Unknown error from CricAPI";
      throw new Error(`CricAPI error: ${scrubSecret(msg)}`);
    }

    return data;
  } catch (error) {
    if (error.name === "AbortError") {
      throw new Error("CricAPI request timed out", { cause: error });
    }
    throw new Error(scrubSecret(error.message), { cause: error });
  } finally {
    clearTimeout(timeout);
  }
}
