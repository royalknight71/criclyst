import { getLiveMatch } from "../../services/match.service";
import MatchCard from "./widgets/MatchCard";
import { useState,useEffect } from "react";
import EmptyLiveMatches from "./widgets/EmptyLiveMatches";

function LiveMatches() {
    const [loading,setLoading]=useState(true)
    const [matches,setMatches]=useState([])
    const [error,setError]=useState("")

    useEffect(()=>{
        setLoading(true)
        async function findLiveMatches() {
            try {
                const response=await getLiveMatch()
                setMatches(response)
            } catch (error) {
                setError(error.message)
            }
            finally{
                setLoading(false)
            }
        }
        findLiveMatches()
    },[])
console.log(matches);

        if(loading)
{
    return <p>Loading...</p>;
}
if(error)
{
    return <h1>{error}</h1>;
}

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
        <div className="grid gap-6">
               { matches.map((match)=>(
    <MatchCard
        key={match._id}
        match={match}
    />
        ))}
        </div>


    </div>
</section>
  );
}

export default LiveMatches;