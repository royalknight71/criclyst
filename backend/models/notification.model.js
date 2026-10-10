/**
 * Notification model definition.
 * Stores user-specific match notifications with read/unread state.
 * Indexed for efficient queries by userId and userId+createdAt.
 */
import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    cricApiMatchId: {
      type: String,
      required: true,
    },
    eventType: {
      type: String,
      enum: ["MATCH_STARTED", "MATCH_COMPLETED", "WICKET", "SCORE_MILESTONE"],
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

notificationSchema.index({ userId: 1, createdAt: -1 });
notificationSchema.index({ userId: 1, read: 1 });
notificationSchema.index({ userId: 1, cricApiMatchId: 1, eventType: 1, createdAt: -1 });

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;
