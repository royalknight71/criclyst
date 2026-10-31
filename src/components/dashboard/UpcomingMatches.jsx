import { useEffect, useState } from "react";
import { getUpcomingMatches } from "../../services/match.service";
import UpcomingMatchCard from "./widgets/UpcomingMatchCard";

function UpcomingMatches() {
  const [loading, setLoading] = useState(true);
  const [matches, setMatches] = useState([]);
  const [meta, setMeta] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    getUpcomingMatches()
      .then((response) => {
        if (!active) return;
        setMatches(response.matches);
        setMeta(response.meta);
      })
      .catch(() => {
        if (active) setError("Upcoming fixtures could not be loaded. Please try again later.");
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

  return (
    <section className="bg-[#0f172a] py-14 md:py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-400">On the calendar</p>
            <h2 className="mt-2 text-4xl font-bold text-white">Upcoming Fixtures</h2>
            <p className="mt-2 text-slate-400">Scheduled matches, ordered by start time.</p>
          </div>
          {lastUpdated && <p className="text-sm text-slate-400">Provider updated {lastUpdated}</p>}
        </div>

        {meta?.stale && lastUpdated && (
          <div className="mb-6 rounded-xl border border-amber-500/30 bg-amber-500/5 px-4 py-3 text-sm text-amber-200">
            These fixtures reflect the last successful provider snapshot from {lastUpdated}.
          </div>
        )}
        {loading ? (
          <div className="rounded-2xl border border-slate-700 bg-slate-900/70 px-6 py-10 text-center text-slate-300" role="status">Loading provider fixtures…</div>
        ) : error ? (
          <div className="rounded-2xl border border-red-500/30 bg-red-500/5 px-6 py-10 text-center text-red-200" role="alert">{error}</div>
        ) : providerUnavailable ? (
          <div className="rounded-2xl border border-amber-500/30 bg-slate-900/70 px-6 py-10 text-center text-slate-300">
            Fixtures are temporarily unavailable because the cricket data provider could not be checked.
          </div>
        ) : matches.length === 0 ? (
          <div className="rounded-2xl border border-slate-700 bg-slate-900/70 px-6 py-10 text-center">
            <h3 className="text-xl font-semibold text-white">No upcoming fixtures available</h3>
            <p className="mt-2 text-slate-400">Provider-confirmed future fixtures will appear here.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {matches.map((match) => <UpcomingMatchCard key={match._id} match={match} />)}
          </div>
        )}
      </div>
    </section>
  );
}

export default UpcomingMatches;
