/**
 * HeroDashboard.jsx
 *
 * Top section of the dashboard presenting the featured player.
 * Fetches the top player on mount and displays their profile summary
 * alongside AI-generated career insights in a two-column layout.
 */

import PlayerSummaryCard from "./widgets/PlayerSummaryCard";
import { useState,useEffect } from "react";
import { getTopPlayer } from "../../services/player.service";
import AIInsight from "./widgets/AIInsight"

/**
 * HeroDashboard component.
 *
 * Renders the "Performance Dashboard" hero section with a live badge,
 * a PlayerSummaryCard for the top player, and an AIInsight panel.
 * Handles loading and error states while fetching the top player data.
 *
 * @component
 * @returns {JSX.Element} The hero dashboard section.
 */
function HeroDashboard() {

    const [player, setPlayer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(()=>{
        setLoading(true)
        async function findTopPlayers() {
          try{
            const player=await getTopPlayer()
            setPlayer(player)
          }
          catch(error)
          {
              setError(error.message);
          }
          finally{
            setLoading(false)
          }
        }
        findTopPlayers()

    },[])
  return (
    <section className="-mt-20 relative z-20 px-6 bg-gradient-to-b
from-[#020617]
via-[#0f172a]
to-[#111827] py-24">
      <div className="mx-auto max-w-6xl rounded-3xl border border-slate-800 bg-slate-900/90 p-8 shadow-2xl backdrop-blur-md ">

        <header className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-cyan-400">
              Live Analytics
            </p>

            <h2 className="mt-2 text-3xl font-bold text-white">
              Performance Dashboard
            </h2>
          </div>

          <span className="rounded-full bg-green-500/15 px-4 py-2 text-sm font-medium text-green-400">
            ● Live
          </span>
        </header>

        <main className="grid gap-6 lg:grid-cols-2">

                <PlayerSummaryCard player={player}/>
                    
                    <AIInsight player={player}/>
            </main>

      </div>
    </section>
  );
}

export default HeroDashboard;