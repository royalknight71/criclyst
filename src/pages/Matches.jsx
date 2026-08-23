/**
 * Matches page (route: /matches).
 *
 * Paginated match directory backed by the API with status tab filtering
 * (All/Live/Upcoming/Completed), format filter and date/venue sorting.
 * State:
 *   - status / format / sortBy / order: filter inputs; all reset
 *     pagination to page 1 on change.
 *   - page / pagination: current page and server-side previous/next metadata.
 *   - matches / loading / error: fetched data and request status.
 * Effects:
 *   - Fetches whenever page, status, format or sorting changes.
 *   - Shows the full-page loading state only on the first load
 *     (tracked via the firstLoad ref) to avoid flicker on refetches.
 */

import { useEffect, useState, useRef } from "react";
import { getMatches } from "../services/match.service";
import MatchCard from "../components/match/MatchCard";

/** Status tabs shown above the grid; "" maps to all statuses. */
const STATUS_TABS = [
  { label: "All", value: "" },
  { label: "Live", value: "live" },
  { label: "Upcoming", value: "upcoming" },
  { label: "Completed", value: "completed" },
];

/** Sort options mapped to whitelisted backend sort fields. */
const SORT_OPTIONS = [
  { label: "Newest First", sortBy: "matchDate", order: "desc" },
  { label: "Oldest First", sortBy: "matchDate", order: "asc" },
  { label: "Venue A-Z", sortBy: "venue", order: "asc" },
];

/**
 * Renders the match directory: hero header, status tabs, format selector,
 * sort selector, clickable match card grid and previous/next pagination.
 * Shows a loading message on first load and an error panel on failure.
 *
 * @returns {JSX.Element} The matches listing UI.
 */
const Matches = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [status, setStatus] = useState("");
  const [format, setFormat] = useState("");
  const [sortBy, setSortBy] = useState("matchDate");
  const [order, setOrder] = useState("desc");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});

  const firstLoad = useRef(true);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        if (firstLoad.current) {
          setLoading(true);
        }

        setError("");

        const data = await getMatches({
          page,
          limit: 8,
          status,
          format,
          sortBy,
          order,
        });

        setMatches(data.data);
        setPagination(data.pagination);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch matches");
      } finally {
        if (firstLoad.current) {
          setLoading(false);
          firstLoad.current = false;
        }
      }
    };

    fetchMatches();
  }, [page, status, format, sortBy, order]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#080d1c] px-6 py-20 text-white">
        <div className="flex min-h-[50vh] items-center justify-center">
          <p className="text-lg text-slate-400">Loading matches...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-[#080d1c] px-6 py-20 text-white">
        <div className="flex min-h-[50vh] items-center justify-center">
          <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-6 py-4 text-red-400">
            {error}
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#080d1c] px-6 py-16 text-white">
      {/* ================= HERO ================= */}

      <section className="mx-auto max-w-4xl text-center">
        <p className="text-sm font-semibold tracking-[0.35em] text-cyan-400">
          CRICKET MATCH DATABASE
        </p>

        <h1 className="mt-5 text-4xl font-extrabold leading-tight sm:text-5xl md:text-6xl">
          Explore Cricket
          <span className="block text-blue-500">Matches</span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-400">
          Browse live, upcoming and completed matches with venues,
          results and full match information.
        </p>
      </section>

      {/* ================= FILTERS ================= */}

      <div className="mx-auto mt-12 flex max-w-7xl flex-col gap-4 md:flex-row md:items-center">
        {/* Status Tabs */}
        <div className="flex flex-wrap gap-2">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.label}
              onClick={() => {
                setStatus(tab.value);
                setPage(1);
              }}
              className={`
                rounded-xl border px-5 py-3
                text-sm font-semibold transition-all duration-300
                ${
                  status === tab.value
                    ? "border-cyan-400 bg-cyan-400/10 text-cyan-400"
                    : "border-slate-700 bg-[#0f172a] text-slate-300 hover:border-cyan-400 hover:text-cyan-400"
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Format */}
        <select
          value={format}
          onChange={(e) => {
            setFormat(e.target.value);
            setPage(1);
          }}
          className="
            rounded-xl
            border border-slate-700
            bg-[#0f172a]
            px-5 py-3
            text-sm text-slate-200
            outline-none
            focus:border-cyan-400
            md:ml-auto md:w-44
          "
        >
          <option value="">All Formats</option>
          <option value="odi">ODI</option>
          <option value="test">Test</option>
          <option value="t20i">T20I</option>
        </select>

        {/* Sort */}
        <select
          value={`${sortBy}:${order}`}
          onChange={(e) => {
            const [nextSortBy, nextOrder] = e.target.value.split(":");
            setSortBy(nextSortBy);
            setOrder(nextOrder);
            setPage(1);
          }}
          className="
            rounded-xl
            border border-slate-700
            bg-[#0f172a]
            px-5 py-3
            text-sm text-slate-200
            outline-none
            focus:border-cyan-400
            md:w-48
          "
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.label} value={`${option.sortBy}:${option.order}`}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* ================= MATCH COUNT ================= */}

      <div className="mx-auto mt-12 max-w-7xl text-sm text-slate-400">
        Showing{" "}
        <span className="font-semibold text-cyan-400">{matches.length}</span>{" "}
        Matches
      </div>

      {/* ================= MATCH GRID ================= */}

      {matches.length > 0 ? (
        <section className="mx-auto mt-6 grid max-w-7xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {matches.map((match) => (
            <MatchCard key={match._id} match={match} />
          ))}
        </section>
      ) : (
        <section className="mx-auto mt-6 max-w-7xl">
          <div className="rounded-3xl border border-slate-800 bg-[#111827] py-20 text-center">
            <p className="text-slate-400">No matches found for these filters</p>
          </div>
        </section>
      )}

      {/* ================= PAGINATION ================= */}

      <div className="mt-10 flex items-center justify-center gap-6">
        <button
          disabled={!pagination.previous}
          onClick={() => setPage(page - 1)}
          className="
            rounded-lg
            border border-slate-700
            px-5 py-2.5
            text-sm text-slate-300
            transition
            hover:border-cyan-400
            hover:text-cyan-400
            disabled:cursor-not-allowed
            disabled:opacity-30
          "
        >
          ← Previous
        </button>

        <span className="text-sm text-slate-400">
          Page{" "}
          <span className="font-semibold text-cyan-400">{page}</span>
        </span>

        <button
          disabled={!pagination.next}
          onClick={() => setPage(page + 1)}
          className="
            rounded-lg
            border border-slate-700
            px-5 py-2.5
            text-sm text-slate-300
            transition
            hover:border-cyan-400
            hover:text-cyan-400
            disabled:cursor-not-allowed
            disabled:opacity-30
          "
        >
          Next →
        </button>
      </div>
    </main>
  );
};

export default Matches;
