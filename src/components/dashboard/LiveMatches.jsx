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
    <div className="max-w-7xl mx-auto px-6">

        <h2 className="text-3xl font-bold text-white">
            Live Matches
        </h2>
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