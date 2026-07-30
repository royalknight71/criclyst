import {getPlayers} from "../services/player.service"
import { useState,useEffect } from "react"
import EmptyPlayers from "../components/dashboard/widgets/EmptyPlayers"
import SearchBar from "../components/player/SearchBar"
import PlayerGrid from "../components/player/PlayerGrid"
import PlayerFilters from "../components/player/PlayerFilters"

function Players()
{
  const [loading,setLoading]=useState(true)
  const [players,setPlayers]=useState([])
  const [error,setError]=useState(null)
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole,setSelectedRole]=useState("")

  useEffect(()=>{
    async function fetchPlayers()
    {
    try
    {
      const response=await getPlayers()
      setPlayers(response)
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
  },[])
const filteredPlayers = players.filter((player) => {

    const matchesRole =
        !selectedRole ||
        player.role === selectedRole;

const search = searchTerm.trim().toLowerCase();

const matchesSearch =
  player.name.toLowerCase().includes(search) ||
  player.country.toLowerCase().includes(search) ||
  player.team.toLowerCase().includes(search);

    return matchesRole && matchesSearch;
});
  if(loading)
    return <p>Loading...</p>

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
    onChange={setSearchTerm}
    placeholder="Search players..."
    />
    </div>

    {/* Filters */}
    <PlayerFilters
    value={selectedRole}
    onChange={setSelectedRole}
/>

</div>


      <div className="mt-20">
    <PlayerGrid players={filteredPlayers}/>
</div>

    {/* Pagination */}
</div>
  </section>
);
}
export default Players