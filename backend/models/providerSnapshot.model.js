/**
 * ProviderSnapshot model.
 *
 * Persists the latest SUCCESSFUL CricAPI "currentMatches" payload so the
 * authoritative match-state map survives backend restarts (Render dyno
 * cycling) and provider outages. Snapshots are only written after a poll
 * succeeds, so this collection can never override fresher provider data
 * with seed or cached data.
 */
import mongoose from "mongoose";

const providerSnapshotSchema = new mongoose.Schema(
  {
    // Logical feed identifier (one document per feed).
    key: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    // Normalized provider matches from the last successful poll.
    matches: {
      type: [mongoose.Schema.Types.Mixed],
      default: [],
    },
    // When the provider payload was fetched (poll start time).
    fetchedAt: {
      type: Date,
      required: true,
    },
    // Number of matches confirmed live in this snapshot.
    liveCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const ProviderSnapshot = mongoose.model("ProviderSnapshot", providerSnapshotSchema);

export default ProviderSnapshot;
