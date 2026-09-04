import { fetchCurrentMatches, fetchMatchScorecard } from "../services/cricketApi.service.js";
import { pollOnce, getLatest } from "../services/cricketPolling.service.js";

const scorecardCache = new Map();
const SCORECARD_CACHE_TTL_MS = 5 * 60 * 1000;

function getCachedScorecard(matchId) {
  const entry = scorecardCache.get(matchId);
  if (!entry) return null;
  if (Date.now() - entry.fetchedAt > SCORECARD_CACHE_TTL_MS) {
    scorecardCache.delete(matchId);
    return null;
  }
  return entry.data;
}

function setCachedScorecard(matchId, data) {
  scorecardCache.set(matchId, { data, fetchedAt: Date.now() });
  if (scorecardCache.size > 50) {
    const oldest = scorecardCache.keys().next().value;
    scorecardCache.delete(oldest);
  }
}

export const testLiveCricket = async (req, res) => {
  try {
    const data = await fetchCurrentMatches();
    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    const message = error.message || "Failed to fetch live cricket data";
    const isConfig = message.includes("CRICKET_API_KEY");
    const status = isConfig ? 500 : 502;
    return res.status(status).json({
      success: false,
      message,
    });
  }
};

export const triggerPoll = async (req, res) => {
  try {
    const result = await pollOnce();
    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getLatestData = (req, res) => {
  const latest = getLatest();
  if (!latest) {
    return res.status(404).json({
      success: false,
      message: "No polling data available yet",
    });
  }
  return res.status(200).json({
    success: true,
    data: latest,
  });
};

export const getMatchScorecard = async (req, res) => {
  const { id } = req.params;
  if (!id || typeof id !== "string" || id.length > 128) {
    return res.status(400).json({
      success: false,
      message: "Invalid match ID",
    });
  }

  const cached = getCachedScorecard(id);
  if (cached) {
    return res.status(200).json({
      success: true,
      data: cached,
      cached: true,
    });
  }

  try {
    const data = await fetchMatchScorecard(id);
    setCachedScorecard(id, data);
    return res.status(200).json({
      success: true,
      data,
      cached: false,
    });
  } catch (error) {
    const message = error.message || "Failed to fetch scorecard";
    return res.status(502).json({
      success: false,
      message,
    });
  }
};
