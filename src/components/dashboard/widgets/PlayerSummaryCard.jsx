import { FaUserCircle } from "react-icons/fa";

function PlayerSummaryCard({player}){
    if(!player)
        return null;
    const countryFlags = {
    india: "🇮🇳",
    england: "🇬🇧",
    australia: "🇦🇺",
    pakistan: "🇵🇰",
    newzealand: "🇳🇿",
    southafrica: "🇿🇦",
    srilanka: "🇱🇰",
    bangladesh: "🇧🇩",
    afghanistan: "🇦🇫",
    westindies: "🏝️",
};
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

        const formattedName = name
            .split(" ")
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");

            const formattedCountry = country
            .split(" ")
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
        const flag = countryFlags[country.toLowerCase()] || "🏏";
    return (
        <div className="h-full rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-cyan-500/15 mt-auto">

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
                   {flag} {formattedCountry} • {role}
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