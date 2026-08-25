/**
 * Teams page (route: /teams).
 *
 * Searchable, format-filterable, paginated team directory backed by the API.
 * State:
 *   - searchTerm / debouncedSearch: search input debounced by 500ms to
 *     limit API calls.
 *   - selectedFormat: format filter (e.g. "odi", "test", "t20i").
 *   - page / totalPages / totalTeams: pagination state.
 *   - teams / loading / error: fetched data and request status.
 * Effects:
 *   - Debounces searchTerm into debouncedSearch.
 *   - Fetches teams whenever page, debouncedSearch or selectedFormat changes.
 */

import { useEffect, useState } from "react";
import { getTeams } from "../services/team.service.js";
import TeamGrid from "../components/team/TeamGrid.jsx";
import TeamSearchBar from "../components/team/TeamSearchBar.jsx";
import TeamFilters from "../components/team/TeamFilters.jsx";
import Pagination from "../components/player/Pagination.jsx";
import TeamSkeleton from "../components/team/TeamSkeleton.jsx";

/**
 * Renders the team directory: hero header, search bar, format filters,
 * result count, team card grid and pagination. Shows a skeleton grid
 * while loading, an error message on fetch failure, and an empty state
 * when no teams match the current query.
 *
 * @returns {JSX.Element} The teams listing UI.
 */
const Teams = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedFormat, setSelectedFormat] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalTeams, setTotalTeams] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    async function fetchTeams() {
      try {
        const response = await getTeams(
          page,
          8,
          debouncedSearch,
          selectedFormat
        );

        setTeams(response.data);
        setTotalPages(response.totalPages);
        setTotalTeams(response.totalTeams);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchTeams();
  }, [page, debouncedSearch, selectedFormat]);

  /** Reset to the first page and apply the new search term. */
  const handleSearchChange = (value) => {
    setPage(1);
    setSearchTerm(value);
  };

  /** Reset to the first page and apply the new format filter. */
  const handleFormatChange = (value) => {
    setPage(1);
    setSelectedFormat(value);
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#0B1120] px-6 py-16 text-white">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <TeamSkeleton key={index} />
            ))}
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-[#0B1120] px-6 py-20 text-white">
        <div className="flex min-h-[50vh] items-center justify-center">
          <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-6 py-4 text-red-400">
            {error}
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0B1120] px-6 py-16 text-white">

      {/* ================= HERO ================= */}

      <section className="mx-auto max-w-4xl text-center">

        <p className="text-sm font-semibold tracking-[0.35em] text-cyan-400">
          CRICKET TEAM DATABASE
        </p>

        <h1 className="mt-5 text-4xl font-extrabold leading-tight sm:text-5xl md:text-6xl">
          Explore Cricket
          <span className="block text-blue-500">
            Teams
          </span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-400">
          Explore international cricket teams, captains,
          coaches and team information.
        </p>

      </section>

      {/* ================= SEARCH & FILTERS ================= */}

      <div className="mx-auto mt-12 flex max-w-7xl flex-col gap-4 md:flex-row">

        <div className="flex-1">
          <TeamSearchBar
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search teams by name or country..."
          />
        </div>

        <TeamFilters
          value={selectedFormat}
          onChange={handleFormatChange}
        />

      </div>

      {/* ================= TEAM COUNT ================= */}

      <div className="mx-auto mt-8 max-w-7xl text-sm text-slate-400">
        Showing{" "}
        <span className="font-bold text-cyan-400">
          {teams.length}
        </span>{" "}
        of{" "}
        <span className="font-bold text-white">
          {totalTeams}
        </span>{" "}
        Teams
      </div>

      {/* ================= TEAM GRID ================= */}

      <div className="mx-auto mt-6 max-w-7xl">
        <TeamGrid teams={teams} />
      </div>

      {/* ================= PAGINATION ================= */}

      {totalPages > 1 && (
        <div className="mt-14">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPrevious={() => setPage((prev) => prev - 1)}
            onNext={() => setPage((prev) => prev + 1)}
          />
        </div>
      )}

    </main>
  );
};

export default Teams;
