const CRICAPI_BASE_URL = "https://api.cricapi.com/v1";
const REQUEST_TIMEOUT_MS = 10000;

function getApiKey() {
  const key = process.env.CRICKET_API_KEY;
  if (!key) {
    throw new Error("CRICKET_API_KEY is not configured");
  }
  return key;
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

    const data = await response.json();

    if (data.status !== "success") {
      const msg = data.message || "Unknown error from CricAPI";
      throw new Error(`CricAPI error: ${msg}`);
    }

    return data;
  } catch (error) {
    if (error.name === "AbortError") {
      throw new Error("CricAPI request timed out", { cause: error });
    }
    throw new Error(error.message, { cause: error });
  } finally {
    clearTimeout(timeout);
  }
}
