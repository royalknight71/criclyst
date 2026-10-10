/**
 * Notification event detection service.
 *
 * Compares previous and current match state to detect meaningful events:
 *   - MATCH_STARTED: match transitions from not-started to live
 *   - MATCH_COMPLETED: match transitions from live to completed
 *   - WICKET: wicket count increases (reliable data only)
 *   - SCORE_MILESTONE: total runs cross a 50-run threshold
 *
 * Maintains an in-memory map of previous match states for deduplication.
 * Each event has a deduplication key to prevent duplicate notifications.
 */

const previousStates = new Map();

const MILESTONE_INTERVALS = [50, 100, 150, 200, 250, 300, 350, 400, 450, 500];

function getDeduplicationKey(matchId, eventType, value) {
  return `${matchId}:${eventType}:${value}`;
}

function extractTotalRuns(scoreArray) {
  if (!Array.isArray(scoreArray) || scoreArray.length === 0) return null;
  let total = 0;
  for (const inning of scoreArray) {
    if (inning && typeof inning.r === "number") {
      total += inning.r;
    }
  }
  return total;
}

function extractTotalWickets(scoreArray) {
  if (!Array.isArray(scoreArray) || scoreArray.length === 0) return null;
  let total = 0;
  for (const inning of scoreArray) {
    if (inning && typeof inning.w === "number") {
      total += inning.w;
    }
  }
  return total;
}

function getMatchLabel(match) {
  if (match.name) return match.name;
  if (match.teams && Array.isArray(match.teams)) {
    return match.teams.join(" vs ");
  }
  return "Cricket Match";
}

function detectEvents(match) {
  if (!match || !match.id) return [];

  const matchId = match.id;
  const events = [];
  const now = new Date().toISOString();
  const label = getMatchLabel(match);

  const prevState = previousStates.get(matchId);
  const currentState = {
    matchStarted: match.matchStarted,
    matchEnded: match.matchEnded,
    matchState: match.matchState,
    score: match.score,
    totalRuns: extractTotalRuns(match.score),
    totalWickets: extractTotalWickets(match.score),
  };

  if (prevState) {
    // MATCH_STARTED: was not started, now is started/live
    const wasStarted = prevState.matchStarted === true || prevState.matchState === "live";
    const isStarted = currentState.matchStarted === true || currentState.matchState === "live";
    if (!wasStarted && isStarted) {
      events.push({
        eventType: "MATCH_STARTED",
        title: "Match Started",
        message: `${label} has started!`,
        deduplicationKey: getDeduplicationKey(matchId, "MATCH_STARTED", "started"),
        metadata: { matchName: label },
      });
    }

    // MATCH_COMPLETED: was live, now is completed
    const wasLive = prevState.matchState === "live" || (prevState.matchStarted === true && prevState.matchEnded !== true);
    const isCompleted = currentState.matchEnded === true || currentState.matchState === "completed";
    if (wasLive && isCompleted) {
      const statusText = match.status || "Completed";
      events.push({
        eventType: "MATCH_COMPLETED",
        title: "Match Completed",
        message: `${label} — ${statusText}`,
        deduplicationKey: getDeduplicationKey(matchId, "MATCH_COMPLETED", "completed"),
        metadata: { matchName: label, status: match.status },
      });
    }

    // WICKET: wicket count increased
    if (prevState.totalWickets !== null && currentState.totalWickets !== null) {
      if (currentState.totalWickets > prevState.totalWickets) {
        const wicketsDown = currentState.totalWickets - prevState.totalWickets;
        events.push({
          eventType: "WICKET",
          title: "Wicket!",
          message: `${label} — ${wicketsDown} wicket(s) fallen! Score: ${formatScore(match.score)}`,
          deduplicationKey: getDeduplicationKey(matchId, "WICKET", `${currentState.totalWickets}-${now}`),
          metadata: { matchName: label, totalWickets: currentState.totalWickets, wicketsDown },
        });
      }
    }

    // SCORE_MILESTONE: total runs cross a threshold
    if (prevState.totalRuns !== null && currentState.totalRuns !== null) {
      for (const milestone of MILESTONE_INTERVALS) {
        if (prevState.totalRuns < milestone && currentState.totalRuns >= milestone) {
          events.push({
            eventType: "SCORE_MILESTONE",
            title: `${milestone} Runs!`,
            message: `${label} — Teams have crossed ${milestone} runs! Score: ${formatScore(match.score)}`,
            deduplicationKey: getDeduplicationKey(matchId, "SCORE_MILESTONE", `${milestone}`),
            metadata: { matchName: label, milestone, totalRuns: currentState.totalRuns },
          });
        }
      }
    }
  }

  // Save current state for next comparison
  previousStates.set(matchId, currentState);

  // Clean up completed matches to prevent unbounded memory growth
  const isCompleted = currentState.matchEnded === true || currentState.matchState === "completed";
  if (isCompleted) {
    previousStates.delete(matchId);
  }

  return events;
}

function formatScore(scoreArray) {
  if (!Array.isArray(scoreArray) || scoreArray.length === 0) return "N/A";
  return scoreArray
    .map((s) => {
      if (!s) return "";
      const runs = typeof s.r === "number" ? s.r : "?";
      const wickets = typeof s.w === "number" ? s.w : "?";
      const overs = typeof s.o === "number" ? s.o : "?";
      return `${runs}/${wickets} (${overs} ov)`;
    })
    .join(" | ");
}

function clearState(matchId) {
  if (matchId) {
    previousStates.delete(matchId);
  } else {
    previousStates.clear();
  }
}

export { detectEvents, clearState, formatScore };
