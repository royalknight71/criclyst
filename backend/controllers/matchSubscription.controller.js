/**
 * Match subscription controller.
 * Handles follow/unfollow for CricAPI live matches.
 * Users subscribe to CricAPI match IDs for real-time notifications.
 */
import MatchSubscription from "../models/matchSubscription.model.js";

export const subscribeToMatch = async (req, res) => {
  try {
    const { matchId } = req.params;

    if (!matchId || typeof matchId !== "string" || matchId.trim().length === 0 || matchId.length > 128) {
      return res.status(400).json({ success: false, message: "Invalid match ID" });
    }

    const existing = await MatchSubscription.findOne({
      userId: req.user._id,
      cricApiMatchId: matchId,
    });

    if (existing) {
      return res.status(200).json({
        success: true,
        message: "Already subscribed to this match",
        subscribed: true,
      });
    }

    await MatchSubscription.create({
      userId: req.user._id,
      cricApiMatchId: matchId,
    });

    return res.status(201).json({
      success: true,
      message: "Subscribed to match notifications",
      subscribed: true,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const unsubscribeFromMatch = async (req, res) => {
  try {
    const { matchId } = req.params;

    if (!matchId || typeof matchId !== "string") {
      return res.status(400).json({ success: false, message: "Invalid match ID" });
    }

    const result = await MatchSubscription.findOneAndDelete({
      userId: req.user._id,
      cricApiMatchId: matchId,
    });

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Subscription not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Unsubscribed from match notifications",
      subscribed: false,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const checkSubscription = async (req, res) => {
  try {
    const { matchId } = req.params;

    if (!matchId || typeof matchId !== "string") {
      return res.status(400).json({ success: false, message: "Invalid match ID" });
    }

    const exists = await MatchSubscription.exists({
      userId: req.user._id,
      cricApiMatchId: matchId,
    });

    return res.status(200).json({
      success: true,
      subscribed: !!exists,
      matchId,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getSubscriptions = async (req, res) => {
  try {
    const subs = await MatchSubscription.find({ userId: req.user._id })
      .select("cricApiMatchId createdAt")
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      data: subs,
      count: subs.length,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
