/**
 * LiveMatches.jsx
 *
 * Dashboard section listing all currently live cricket matches.
 * Fetches live matches on mount and renders a MatchCard for each one,
 * with dedicated loading, error, and empty states.
 */

import { getLiveMatch } from "../../services/match.service";
import MatchCard from "./widgets/MatchCard";
import { useState,useEffect } from "react";
import EmptyLiveMatches from "./widgets/EmptyLiveMatches";

/**
 * LiveMatches component.
 *
 * Loads live match data via getLiveMatch and displays it as a grid of cards.
 * Shows a loading indicator, an error message, or an empty-state section
 * depending on the fetch outcome.
 *
 * @component
 * @returns {JSX.Element} The live matches section.
 */
function LiveMatches() {
    const [loading,setLoading]=useState(true)
    const [matches,setMatches]=useState([])
    const [meta,setMeta]=useState(null)
    const [error,setError]=useState("")

    useEffect(()=>{
        async function findLiveMatches() {
            try {
                const response=await getLiveMatch()
                setMatches(response.matches || [])
                setMeta(response.meta || null)
            } catch (error) {
                setError(error.message)
            }
            finally{
                setLoading(false)
            }
        }
        findLiveMatches()
    },[])

        if(loading)
{
    return <p>Loading...</p>;
}
if(error)
{
    return <h1>{error}</h1>;
}

// Provider could not be checked at all — say so instead of claiming
// there are no live matches.
const providerUnavailable = meta?.providerStatus === "unavailable";
const providerStale = meta?.stale === true;

if(matches.length===0 && providerUnavailable)
    return (
<section className="bg-gradient-to-b from-slate-800 via-slate-900 to-[#0f172a] py-20">
    <div className="max-w-4xl mx-auto px-6">
        <div className="mb-10">
    <span className="text-cyan-400 uppercase tracking-widest text-sm font-semibold">
        LIVE CRICKET
    </span>
    <h2 className="text-4xl font-bold text-white mt-2">
        Live Matches
    </h2>
</div>
        <div className="rounded-2xl border border-yellow-500/30 bg-yellow-500/5 px-6 py-10 text-center">
            <p className="font-semibold text-yellow-300">
                Live scores are temporarily unavailable
            </p>
            <p className="mt-2 text-slate-400">
                The cricket data provider could not be reached, so live
                matches cannot be confirmed right now. Please check back
                shortly.
            </p>
        </div>
    </div>
</section>
    );

if(matches.length===0)
    return <EmptyLiveMatches />;

  return (
<section className="bg-gradient-to-b from-slate-800 via-slate-900 to-[#0f172a] py-20">
    <div className="max-w-4xl mx-auto px-6">

        <div className="mb-10">
    <span className="text-cyan-400 uppercase tracking-widest text-sm font-semibold">
        LIVE CRICKET
    </span>

    <h2 className="text-4xl font-bold text-white mt-2">
        Live Matches
    </h2>

    <p className="text-slate-400 mt-2">
        Follow ongoing matches in real time.
    </p>
</div>

        {providerStale && (
            <div className="mb-6 rounded-xl border border-yellow-500/30 bg-yellow-500/5 px-4 py-3 text-sm text-yellow-300">
                {providerUnavailable
                    ? "The live data provider could not be checked — these matches may no longer be in progress."
                    : `Live data may be delayed${
                          meta?.lastSyncAt
                              ? ` — last synced ${new Date(meta.lastSyncAt).toLocaleString()}`
                              : ""
                      }.`}
            </div>
        )}

        <div className="grid gap-6">
               { matches.map((match)=>(
    <MatchCard
        key={match._id || match.providerId}
        match={match}
    />
        ))}
        </div>


    </div>
</section>
  );
}

export default LiveMatches;