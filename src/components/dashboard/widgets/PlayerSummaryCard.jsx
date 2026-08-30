/**
 * PlayerSummaryCard.jsx
 *
 * Dashboard widget presenting a featured player's profile: name, country
 * flag, role, key career statistics (runs, average, strike rate, matches),
 * and batting style.
 */

import { useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import CountryFlag from "../../common/CountryFlag";

/**
 * PlayerSummaryCard component.
 *
 * Renders nothing if no player data is provided. Country names are mapped
 * to flag emojis with a cricket-bat emoji as the fallback.
 *
 * @component
 * @param {Object} props - Component props.
 * @param {Object} [props.player] - Player data containing name, country,
 *   role, runs, average, strikeRate, matches, and battingStyle.
 * @returns {JSX.Element|null} The player summary card, or null when no
 *   player is supplied.
 */
function PlayerSummaryCard({player}){
    const navigate = useNavigate();
    if(!player)
        return null;
        const {
            name,
            country,
            role,
            runs,
            average,
            strikeRate,
            matches,
            battingStyle,
        } = player;

        const formattedName = (name || "")
            .split(" ")
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");

            const formattedCountry = (country || "")
            .split(" ")
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
    return (
        <div
            onClick={() => navigate(`/players/${player._id}`)}
            className="h-full cursor-pointer rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400/40 hover:shadow-cyan-500/15 mt-auto"
        >

            {/* Profile */}
            <div className="flex flex-col items-center">

                <FaUserCircle className="text-6xl text-cyan-400" />

                <h3 className="mt-4 text-3xl font-bold text-white mb-3">
                    {formattedName}
                </h3>
                <span className="inline-flex items-center rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-medium text-cyan-400 border border-cyan-500/20">
  Elite International Player
</span>

                <p className="mt-1 text-sm text-slate-400">
                   <CountryFlag country={country} className="text-base mr-1" />
                   {formattedCountry} • {role}
                </p>

            </div>

            <hr className="my-6 border-slate-700" />

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">

                <div>
                    <p className="text-sm text-slate-500">Runs</p>
                    <p className="mt-1 text-xl font-semibold text-white">
                        {runs.toLocaleString()}
                    </p>
                </div>

                <div>
                    <p className="text-sm text-slate-500">Average</p>
                    <p className="mt-1 text-xl font-semibold text-white">
                        {average}
                    </p>
                </div>

                <div>
                    <p className="text-sm text-slate-500">Strike Rate</p>
                    <p className="mt-1 text-xl font-semibold text-white">
                        {strikeRate}
                    </p>
                </div>

                <div>
                    <p className="text-sm text-slate-500">Matches</p>
                    <p className="mt-1 text-xl font-semibold text-white">
                        {matches}
                    </p>
                </div>

            </div>

            <hr className="my-6 border-slate-700" />

            {/* Batting Style */}

            <div>

                <p className="text-sm text-slate-500">
                    Batting Style
                </p>

                <p className="mt-2 font-medium text-cyan-400">
                    {battingStyle}
                </p>

            </div>

        </div>
    )
}
export default PlayerSummaryCard