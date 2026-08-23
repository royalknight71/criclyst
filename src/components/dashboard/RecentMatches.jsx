/**
 * RecentMatches.jsx
 *
 * Dashboard section listing recently completed cricket matches.
 * Fetches match history on mount and renders a RecentMatchCard for each
 * completed match, with dedicated loading, error, and empty states.
 */

import { getRecentMatches } from "../../services/match.service";
import RecentMatchCard from "./widgets/RecentMatchCard";
import EmptyRecentMatches from "./widgets/EmptyRecentMatches"
import { useState,useEffect } from "react";

/**
 * RecentMatches component.
 *
 * Loads recent matches via getRecentMatches and displays them as a list of
 * result cards. Shows a loading indicator, an error message, or an
 * empty-state section depending on the fetch outcome.
 *
 * @component
 * @returns {JSX.Element} The recent matches section.
 */
function RecentMatches() {
    const [loading,setLoading]=useState(true)
    const [matches,setMatches]=useState([])
    const [error,setError]=useState(null)

    useEffect(()=>{
        async function findRecentMatches()
        {
            try{
                const response = await getRecentMatches();
                setMatches(response)
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
        findRecentMatches()
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
        <section className="bg-gradient-to-b from-slate-800 via-slate-900 to-[#0f172a] py-20">
    {error}
    </section>
</div>
    )
    }
    if(matches.length===0)
    {
        return <EmptyRecentMatches/>
    }

        return (
<section className="bg-gradient-to-b from-slate-800 via-slate-900 to-[#0f172a] py-20">
    <div className="max-w-4xl mx-auto px-6">

 <div className="mb-10">

    <span className="uppercase tracking-widest text-cyan-400 text-sm font-semibold">
        MATCH HISTORY
    </span>

    <h2 className="text-4xl font-bold text-white mt-2">
        Recent Matches
    </h2>

    <p className="text-slate-400 mt-2">
        Relive the latest international cricket action.
    </p>

</div>
        <div className="grid gap-6">
               { matches.map((match)=>(
    <RecentMatchCard
        key={match._id}
        match={match}
    />
        ))}
        </div>


    </div>
</section>
  );
}

export default RecentMatches;