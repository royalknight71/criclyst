/**
 * Shared match-display helpers.
 *
 * CricAPI quirks these helpers compensate for:
 *   - `score[].inning` is a free-form label like "australia Inning 1"
 *     whose capitalization does not match team names.
 *   - `teamInfo` order does NOT reliably match `teams` order (e.g. for
 *     "South Africa vs Australia": teams = [South Africa, Australia] but
 *     teamInfo = [Australia, South Africa]). LiveMatchCard renders slots
 *     from teamInfo, so innings must be paired against teamInfo, not teams.
 *   - Labels are sometimes malformed, e.g. "Pakistan,Sri Lanka Inning 1"
 *     for one team's innings — so matching must handle punctuation and
 *     must not assign the same innings to both teams.
 *   - Test matches carry multiple innings per team; the live innings is
 *     the LAST one for that team.
 */

/** Lowercase, strip punctuation, collapse whitespace. */
function normalizeLabel(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}

/** "pakistan sri lanka inning 1" starts with "pakistan" at a word boundary. */
function isPrefixMatch(label, name) {
  if (!label || !name) return false;
  return label === name || label.startsWith(`${name} `);
}

/** "pakistan sri lanka inning 1" contains "sri lanka" as a whole token run. */
function isTokenMatch(label, name) {
  if (!label || !name) return false;
  return ` ${label} `.includes(` ${name} `);
}

/**
 * Pick the innings for display slot `teamIndex` (0 or 1), or null.
 *
 * Matching is done against the team rendered in that slot (teamInfo when
 * present, otherwise teams[teamIndex]) — never against teams[i] when
 * teamInfo exists, since those arrays can be ordered differently.
 */
export function getTeamInningsScore(match, teamIndex) {
  if (!match || !Array.isArray(match.score) || match.score.length === 0) {
    return null;
  }

  const teams = Array.isArray(match.teams) ? match.teams : [];
  const teamInfo = Array.isArray(match.teamInfo) ? match.teamInfo : [];
  const info = teamInfo[teamIndex];
  const teamNames = info
    ? [info.name, info.shortname]
    : [teams[teamIndex]];

  const names = teamNames
    .map(normalizeLabel)
    .filter((n) => n.length > 0);

  if (names.length === 0) return null;

  const scored = match.score.map((inning) => {
    const label = normalizeLabel(inning?.inning);
    return { inning, label };
  });

  // Tier 1: label starts with the team name ("australia inning 1").
  // Tier 2: team name appears as tokens anywhere (malformed labels).
  // Within a tier the LAST innings wins (current innings in Tests).
  const tier1 = scored.filter((e) =>
    names.some((n) => isPrefixMatch(e.label, n))
  );
  if (tier1.length > 0) return tier1[tier1.length - 1].inning;

  // Tier 2 must not steal an innings the other slot claimed in tier 1 —
  // otherwise a malformed label like "pakistan,sri lanka inning 1" would
  // be handed to both teams.
  const otherInfo = teamInfo[1 - teamIndex];
  const otherNames = (otherInfo
    ? [otherInfo.name, otherInfo.shortname]
    : [teams[1 - teamIndex]]
  )
    .map(normalizeLabel)
    .filter((n) => n.length > 0);

  const tier2 = scored.filter((e) => {
    if (!names.some((n) => isTokenMatch(e.label, n))) return false;
    // Skip entries that prefix-match the other team (those belong to it).
    return !otherNames.some((n) => isPrefixMatch(e.label, n));
  });
  if (tier2.length > 0) return tier2[tier2.length - 1].inning;

  // Last resort: generic labels ("1st Inning") with one innings per team.
  if (match.score.length === teams.length && teams.length > 0) {
    return match.score[teamIndex] || null;
  }

  return null;
}

/**
 * Infer a match format label when the provider omits `matchType`.
 * Only used as a display fallback; never overrides a provided value.
 */
export function inferMatchType(match) {
  if (match?.matchType) return match.matchType;
  const name = String(match?.name || "").toLowerCase();
  if (/\btest\b/.test(name)) return "test";
  if (/\bodi\b|one day|\bone-day\b/.test(name)) return "odi";
  if (/\bt20\b|twenty20/.test(name)) return "t20";
  return "";
}
