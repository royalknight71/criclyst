import { getTopPlayers } from "../../services/player.service";
import { useState,useEffect } from "react";
import EmptyTopPlayers from "./widgets/EmptyTopPlayers";
import TopPlayerCard from "./widgets/TopPlayerCard";

function TopPlayers() {
  const [loading,setLoading]=useState(true)
  const [players,setPlayers]=useState([])
  const [error,setError]=useState(null)

  useEffect(()=>{
    async function findTopPlayers()
    {
      try{
        const response=await getTopPlayers()
        console.log(response)
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

    findTopPlayers()
  },[])

  if(loading)
    return <p>Loading...</p>

  if(error)
  {
                return (
     <div className="text-center text-red-400 py-20">
        <section className="bg-gradient-to-b from-slate-800 via-slate-900 to-[#0f172a] py-20">
    {error}
    </section>
</div>
    )
  }
  if(players.length===0)
  {
    return <EmptyTopPlayers/>
  }


return (
<section className="bg-gradient-to-b from-slate-800 via-slate-900 to-[#0f172a] py-20">

    <div className="max-w-5xl mx-auto px-6">

        {/* Heading */}

        <div className="mb-10">

            <span className="uppercase tracking-widest text-cyan-400 text-sm font-semibold">
                TOP PLAYERS
            </span>

            <h2 className="mt-2 text-4xl font-bold text-white">
                Top Performers
            </h2>

            <p className="mt-2 text-slate-400">
                Discover the highest-performing players across international cricket.
            </p>

        </div>

        {/* Cards */}

        <div className="grid gap-6">

            {
               players.map((player, index) => (
  <TopPlayerCard
    key={player._id}
    player={player}
    index={index}
  />
))
            }

        </div>

    </div>

</section>
);
}

export default TopPlayers;