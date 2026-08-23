/**
 * StatsCards.jsx
 *
 * Dashboard section showing platform-wide statistics (players, teams,
 * matches, live matches). Fetches aggregate counts on mount and renders
 * them as a responsive grid of StatCard tiles.
 */

import StatCard from "./widgets/StatCard"
import { getDashboardStats } from "../../services/dashboard.service";
import { useState,useEffect } from "react";
import { FaUsers,FaPeopleGroup,FaSignal } from "react-icons/fa6";
import { MdSportsCricket } from "react-icons/md";

/**
 * StatsCards component.
 *
 * Loads aggregate dashboard stats via getDashboardStats and displays four
 * summary cards. Shows a loading indicator or error message depending on
 * the fetch outcome.
 *
 * @component
 * @returns {JSX.Element} The dashboard statistics section.
 */
function StatsCards() {
        const [statsData, setStatsData] = useState(null);
        const [loading, setLoading] = useState(true);
        const [error, setError] = useState("");
    
        useEffect(()=>{
            setLoading(true)
            async function findStats() {
              try{
                const response =await getDashboardStats()
                setStatsData(response)
              }
              catch(error)
              {
                  setError(error.message);
              }
              finally{
                setLoading(false)
              }
            }
            findStats()
    
        },[])
        const stats = [
  {
    title: "Players",
    value: statsData?.totalPlayers,
    subtitle: "Registered Players",
    icon: <FaUsers />,
  },
  {
    title: "Teams",
    value: statsData?.totalTeams,
    subtitle: "Registered Teams",
    icon: <FaPeopleGroup />,
  },
  {
    title: "Matches",
    value: statsData?.totalMatches,
    subtitle: "Matches Played",
    icon: <MdSportsCricket />,
  },
  {
    title: "Live",
    value: statsData?.liveMatches,
    subtitle: "Live Matches",
    icon: <FaSignal />,
  },
];
        if(loading)
{
    return <p>Loading...</p>;
}
if(error)
{
    return <h1>{error}</h1>;
}
return (
  <section className="bg-slate-900 py-24">
    <div className="max-w-7xl mx-auto px-6">

      {/* Heading */}
      <div className="mb-12">
        <span className="text-cyan-400 font-medium tracking-wide uppercase text-sm">
          Live Dashboard
        </span>

        <h2 className="mt-3 text-4xl font-bold text-white">
          Dashboard Statistics
        </h2>

        <p className="mt-3 text-slate-400 max-w-2xl">
          Real-time overview of players, teams and matches from the Criclyst
          analytics engine.
        </p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
        {stats.map((stat) => (
          <StatCard
            key={stat.title}
            {...stat}
          />
        ))}
      </div>

    </div>
  </section>
);
         

}

export default StatsCards;