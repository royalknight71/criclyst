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

  console.log(`[cricketApi:DIAG] fetchCurrentMatches() — starting fetch to cricapi.com...`);
  const t0 = Date.now();
  const controller = new AbortController();
  const timeout = setTimeout(() => {
    console.error(`[cricketApi:DIAG] fetchCurrentMatches() — ABORT after ${REQUEST_TIMEOUT_MS}ms`);
    controller.abort();
  }, REQUEST_TIMEOUT_MS);

  try {
    console.log(`[cricketApi:DIAG] fetchCurrentMatches() — calling fetch()...`);
    const response = await fetch(url, { signal: controller.signal });
    console.log(`[cricketApi:DIAG] fetchCurrentMatches() — fetch() resolved in ${Date.now() - t0}ms, status=${response.status}`);

    if (!response.ok) {
      throw new Error(`CricAPI responded with status ${response.status}`);
    }

    console.log(`[cricketApi:DIAG] fetchCurrentMatches() — parsing JSON...`);
    const data = await response.json();
    console.log(`[cricketApi:DIAG] fetchCurrentMatches() — JSON parsed in ${Date.now() - t0}ms, data.status=${data.status}, data.data.length=${Array.isArray(data.data) ? data.data.length : "N/A"}`);

    if (data.status !== "success") {
      const msg = data.reason || data.message || "Unknown error from CricAPI";
      throw new Error(`CricAPI error: ${msg}`);
    }

    console.log(`[cricketApi:DIAG] fetchCurrentMatches() — returning successfully`);
    return data;
  } catch (error) {
    console.error(`[cricketApi:DIAG] fetchCurrentMatches() — error after ${Date.now() - t0}ms: ${error.message} (name=${error.name})`);
    if (error.name === "AbortError") {
      throw new Error("CricAPI request timed out", { cause: error });
    }
    throw new Error(error.message, { cause: error });
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

    const data = await response.json();

    if (data.status !== "success") {
      const msg = data.reason || data.message || "Unknown error from CricAPI";
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
