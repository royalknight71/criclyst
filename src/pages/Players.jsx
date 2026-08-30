/**
 * Players page (route: /players).
 *
 * Searchable, filterable, paginated player directory backed by the API.
 * State:
 *   - searchTerm / debouncedSearch: search input debounced by 500ms to
 *     limit API calls.
 *   - selectedRole: role filter (e.g. "Batsman", "Bowler").
 *   - page / totalPages / totalPlayers: pagination state.
 *   - players / loading / error: fetched data and request status.
 * Effects:
 *   - Debounces searchTerm into debouncedSearch.
 *   - Fetches players whenever page, debouncedSearch or selectedRole changes.
 */

import {getPlayers} from "../services/player.service"
import { useState,useEffect } from "react"
import EmptyPlayers from "../components/dashboard/widgets/EmptyPlayers"
import SearchBar from "../components/player/SearchBar"
import PlayerGrid from "../components/player/PlayerGrid"
import PlayerFilters from "../components/player/PlayerFilters"
import Pagination from "../components/player/Pagination";
import PlayerSkeleton from "../components/player/PlayerSkeleton";

/**
 * Renders the player directory: hero header, search bar, role filters,
 * result grid and pagination. Shows a skeleton grid while loading,
 * an error message on fetch failure, and an empty state when no
 * players match the current query.
 *
 * @returns {JSX.Element} The players listing UI.
 */
function Players()
{
  const [loading,setLoading]=useState(true)
  const [players,setPlayers]=useState([])
  const [error,setError]=useState(null)
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedRole,setSelectedRole]=useState("")
  const [page, setPage] = useState(1);

const [totalPages, setTotalPages] = useState(1);

const [totalPlayers, setTotalPlayers] = useState(0);

useEffect(() => {
  const timer = setTimeout(() => {
    setDebouncedSearch(searchTerm);
  }, 500);

  return () => clearTimeout(timer);

}, [searchTerm]);

  useEffect(()=>{
    async function fetchPlayers()
    {
    try
    {
      const response = await getPlayers(
  page,
  8,
  debouncedSearch,
  selectedRole
);

setPlayers(response.data);

setTotalPages(response.totalPages);

setTotalPlayers(response.totalPlayers);
    }
    catch(error)
    {
      setError(error.message)
    }
    finally
    {
      setLoading(false)
    }
  }
  fetchPlayers()
  },[page, debouncedSearch, selectedRole])
  // const search = searchTerm.trim().toLowerCase();
// const filteredPlayers = players.filter((player) => {

//     const matchesRole =
//         !selectedRole ||
//         player.role === selectedRole;

// const matchesSearch =
//   player.name.toLowerCase().includes(search) ||
//   player.country.toLowerCase().includes(search) ||
//   player.team?.toLowerCase().includes(search);

//     return matchesRole && matchesSearch;
// });
/** Reset to the first page and apply the new search term. */
const handleSearchChange = (value) => {
  setPage(1);
  setSearchTerm(value);
};

/** Reset to the first page and apply the new role filter. */
const handleRoleChange = (value) => {
  setPage(1);
  setSelectedRole(value);
};

if (loading) {
  return (
    <section className="relative min-h-screen overflow-hidden bg-[#0B1120]">

      <div className="absolute top-20 left-0 h-96 w-96 rounded-full bg-cyan-500/10 blur-[120px]" />

      <div className="absolute right-0 top-40 h-96 w-96 rounded-full bg-purple-500/10 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-6 py-16">

        <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">

          {Array.from({ length: 8 }).map((_, index) => (
            <PlayerSkeleton key={index} />
          ))}

        </div>

      </div>

    </section>
  );
}

  if(error)
    return (
  <div className="error-state">
    <h2>Something went wrong.</h2>
    <p>{error}</p>
  </div>
);

  if(players.length===0)
    return <EmptyPlayers/>

return (
<section className="relative min-h-screen overflow-hidden bg-[#0B1120]">

  <div className="absolute top-20 left-0 h-96 w-96 rounded-full bg-cyan-500/10 blur-[120px]" />

  <div className="absolute right-0 top-40 h-96 w-96 rounded-full bg-purple-500/10 blur-[120px]" />

  <div className="relative mx-auto max-w-7xl px-6 py-16">
    {/* <div className="players-header">
      <h1>Players</h1>
      <p>{players.length} Players Found</p>
    </div> */}
    <div className="mb-12 text-center">

  <p className="text-cyan-400 font-semibold tracking-[0.3em] uppercase">
    AI PLAYER DATABASE
  </p>

  <h1
  className="
    mt-4
    text-5xl
    font-black
    leading-tight
    text-white
  "
>
  Explore Cricket

  <span
    className="
      block
      mt-2
      bg-gradient-to-r
      from-cyan-400
      via-blue-500
      to-purple-500
      bg-clip-text
      text-transparent
    "
  >
    Players
  </span>

</h1>

  <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-400">
    Search, filter and analyze professional cricketers
    with AI-powered statistics and performance insights.
  </p>

</div>
<div className="mt-12 flex flex-col gap-4 md:flex-row">
    {/* SearchBar */}
    <div className="flex-1">
    <SearchBar
    value={searchTerm}
    onChange={handleSearchChange}
    placeholder="Search players by name, country or team..."
    />
    </div>

    {/* Filters */}
    <PlayerFilters
    value={selectedRole}
    onChange={handleRoleChange}
/>

</div>

<div className="mt-6 flex items-center justify-between">

    <p className="text-sm text-slate-400">

        Showing

        <span className="mx-2 font-bold text-cyan-400">
            {players.length}
        </span>

        of

        <span className="mx-2 font-bold text-white">
            {totalPlayers}
        </span>

        Players

    </p>

</div>
      <div className="mt-12">
    <PlayerGrid players={players} />
</div>
{
  totalPages > 1 && (
    <div className="mt-14">
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPrevious={() => setPage(prev => prev - 1)}
        onNext={() => setPage(prev => prev + 1)}
      />
    </div>
  )
}
</div>
  </section>
);
}
export default Players