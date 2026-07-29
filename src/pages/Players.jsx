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
  <section className="players-page">

    <div className="players-header">
      <h1>Players</h1>
      <p>{players.length} Players Found</p>
    </div>

    {/* SearchBar */}
    <SearchBar
    value={searchTerm}
    onChange={setSearchTerm}
    placeholder="Search players..."
    />
    {/* Filters */}
    <PlayerFilters
    value={selectedRole}
    onChange={setSelectedRole}
/>


      <PlayerGrid players={players} />

    {/* Pagination */}

  </section>
);
}
export default Players