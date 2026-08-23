/**
 * UpcomingMatches.jsx
 *
 * Dashboard section listing scheduled (upcoming) cricket matches.
 * Fetches upcoming fixtures on mount and renders an UpcomingMatchCard for
 * each one, with dedicated loading, error, and empty states.
 */

import { getUpcomingMatches } from "../../services/match.service";
import { useState,useEffect } from "react";
import UpcomingMatchCard from "./widgets/UpcomingMatchCard";
import EmptyUpcomingMatches from "./widgets/EmptyUpcomingMatches";

/**
 * UpcomingMatches component.
 *
 * Loads upcoming fixtures via getUpcomingMatches and displays them as a list
 * of cards. Shows a loading indicator, an error message, or an empty-state
 * section depending on the fetch outcome.
 *
 * @component
 * @returns {JSX.Element} The upcoming matches section.
 */
function UpcomingMatches() {
  const [loading,setLoading]=useState(true)
  const [matches,setMatches]=useState([])
  const [error,setError]=useState("")

  useEffect(()=>{
//    setLoading(true)
    async function findUpcomingMatches()
    {
      try{
        const response=await getUpcomingMatches()
        console.log(response);
        setMatches(response)
        
      }
      catch(error)
      {
        setError(error.message)
      }
      finally{
        setLoading(false)
      }
    }
    findUpcomingMatches()
  },[])

  if(loading)
  {
    return (
      <p>Loading...</p>
    )
  }
  if(error)
  {
    return (
     <div className="text-center text-red-400 py-20">
    {error}
</div>
    )
  }
  if(matches.length===0)
  {
    return <EmptyUpcomingMatches/>
  }

    return (
<section className="bg-gradient-to-b from-slate-800 via-slate-900 to-[#0f172a] py-20">
    <div className="max-w-4xl mx-auto px-6">

        <div className="mb-10">

    <h2 className="text-4xl font-bold text-white mt-2">
        Upcoming Matches
    </h2>

    <p className="text-slate-400 mt-2">
        Never miss an upcoming international clash.
    </p>
</div>
        <div className="grid gap-6">
               { matches.map((match)=>(
    <UpcomingMatchCard
        key={match._id}
        match={match}
    />
        ))}
        </div>


    </div>
</section>
  );
}

export default UpcomingMatches;