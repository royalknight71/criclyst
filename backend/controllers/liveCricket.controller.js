import { fetchCurrentMatches } from "../services/cricketApi.service.js";
import { pollOnce, getLatest } from "../services/cricketPolling.service.js";

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
