import { useEffect, useState } from "react";
import { getLiveMatch } from "../../services/match.service";
import MatchCard from "./widgets/MatchCard";

function LiveMatches() {
  const [loading, setLoading] = useState(true);
  const [matches, setMatches] = useState([]);
  const [meta, setMeta] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    getLiveMatch()
      .then((response) => {
        if (!active) return;
        setMatches(response.matches);
        setMeta(response.meta);
      })
      .catch(() => {
        if (active) setError("Live matches could not be loaded. Please try again later.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, []);

  const lastUpdated = meta?.lastSyncAt
    ? new Date(meta.lastSyncAt).toLocaleString()
    : null;
  const providerUnavailable = meta?.providerStatus === "unavailable";
  const providerStale = meta?.stale === true;

  return (
    <section className="bg-gradient-to-b from-[#172840] via-[#182234] to-[#0f172a] py-14 md:py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-400">Live cricket</p>
            <h2 className="mt-2 text-4xl font-bold text-white">Live Matches</h2>
            <p className="mt-2 text-slate-400">Follow matches currently confirmed in progress.</p>
          </div>
          {lastUpdated && <p className="text-sm text-slate-400">Provider updated {lastUpdated}</p>}
        </div>

        {providerStale && !loading && (
          <div className="mb-6 rounded-xl border border-amber-500/30 bg-amber-500/5 px-4 py-3 text-sm text-amber-200">
            {providerUnavailable
              ? "Live status cannot be confirmed because the cricket data provider is unavailable."
              : `Showing the last provider snapshot${lastUpdated ? ` from ${lastUpdated}` : ""}; live status may have changed.`}
          </div>
        )}

        {loading ? (
          <div className="rounded-2xl border border-slate-700 bg-slate-900/70 px-6 py-10 text-center text-slate-300" role="status">Checking provider-confirmed live matches…</div>
        ) : error ? (
          <div className="rounded-2xl border border-red-500/30 bg-red-500/5 px-6 py-10 text-center text-red-200" role="alert">{error}</div>
        ) : providerUnavailable ? (
          <div className="rounded-2xl border border-amber-500/30 bg-slate-900/70 px-6 py-10 text-center text-slate-300">
            Live scores are temporarily unavailable. No match is being labelled live without provider confirmation.
          </div>
        ) : matches.length === 0 ? (
          <div className="rounded-2xl border border-slate-700 bg-slate-900/70 px-6 py-10 text-center">
            <h3 className="text-xl font-semibold text-white">No confirmed live matches</h3>
            <p className="mt-2 text-slate-400">Provider-confirmed live scores will appear here when a match is in progress.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {matches.map((match) => <MatchCard key={match._id || match.providerId} match={match} />)}
          </div>
        )}
      </div>
    </section>
  );
}

export default LiveMatches;
