/**
 * MatchSubscription model definition.
 * Maps users to CricAPI match IDs they are following for live notifications.
 * Lightweight bridge between the user favorites system (MongoDB ObjectIds)
 * and the CricAPI live-score system (string IDs).
 */
import mongoose from "mongoose";

const matchSubscriptionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    cricApiMatchId: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

matchSubscriptionSchema.index({ userId: 1, cricApiMatchId: 1 }, { unique: true });
matchSubscriptionSchema.index({ cricApiMatchId: 1 });

const MatchSubscription = mongoose.model(
  "MatchSubscription",
  matchSubscriptionSchema
);

export default MatchSubscription;
