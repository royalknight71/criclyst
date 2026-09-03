import { fetchCurrentMatches } from "../services/cricketApi.service.js";

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
