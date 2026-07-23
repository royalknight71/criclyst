import { FaCircle, FaLocationDot, FaArrowRight } from "react-icons/fa6";
import { MdSportsCricket } from "react-icons/md";

function MatchCard({match}){
    const formatName = (name) =>
    name
      ?.split(" ")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  return (
    <div className="group bg-slate-800/90 backdrop-blur-md border border-slate-700 rounded-3xl p-8 transition-all duration-300 hover:-translate-y-2 hover:border-cyan-400 hover:shadow-2xl hover:shadow-cyan-500/10">

      {/* Header */}

      <div className="flex justify-between items-center">

        <div className="flex items-center gap-3">

          <span className="h-3 w-3 rounded-full bg-red-500 animate-pulse"></span>

          <span className="uppercase tracking-widest font-semibold text-red-400">
            Live
          </span>

        </div>

        <div className="text-slate-400 font-medium">

          {match.format.toUpperCase()} • {match.scorecard.overs} Overs

        </div>

      </div>

      <div className="h-px bg-slate-700 my-8"></div>

      {/* Teams */}

      <div className="grid grid-cols-3 items-center">

        {/* Team A */}

        <div className="text-center">

          <div className="w-20 h-20 rounded-full bg-cyan-500/10 border border-cyan-500 flex items-center justify-center mx-auto mb-4">

            <span className="text-2xl font-bold text-cyan-400">
              {match.teamA?.name?.substring(0,3)?.toUpperCase()}
            </span>

          </div>

          <h2 className="text-xl font-bold text-white">
            {formatName(match.teamA.name)}
          </h2>

          <p className="mt-2 text-4xl font-extrabold text-cyan-400">
            {match.scorecard.teamAScore}
          </p>

        </div>

        {/* VS */}

        <div className="text-center">

          <div className="text-3xl font-black text-slate-500">
            VS
          </div>

        </div>

        {/* Team B */}

        <div className="text-center">

          <div className="w-20 h-20 rounded-full bg-cyan-500/10 border border-cyan-500 flex items-center justify-center mx-auto mb-4">

            <span className="text-2xl font-bold text-cyan-400">
              {match.teamB?.name?.substring(0,3)?.toUpperCase()}
            </span>

          </div>

          <h2 className="text-xl font-bold text-white">
            {formatName(match.teamB.name)}
          </h2>

          <p className="mt-2 text-4xl font-extrabold text-cyan-400">
            {match.scorecard.teamBScore}
          </p>

        </div>

      </div>

      <div className="h-px bg-slate-700 my-8"></div>

      {/* Match Info */}

      <div className="grid md:grid-cols-2 gap-5">

        <div className="flex items-start gap-3">

          <FaLocationDot className="text-cyan-400 mt-1" />

          <div>

            <p className="text-slate-400 text-sm uppercase">
              Venue
            </p>

            <p className="text-white">
              {match.venue}
            </p>

          </div>

        </div>

        <div className="flex items-start gap-3">

          <MdSportsCricket className="text-cyan-400 mt-1 text-lg"/>

          <div>

            <p className="text-slate-400 text-sm uppercase">
              Toss
            </p>

            <p className="text-white">
              {match.tossWinner?.name} chose to {match.tossDecision}
            </p>

          </div>

        </div>

      </div>

      {/* Stats */}

      <div className="grid grid-cols-2 gap-5 mt-8">

        <div className="bg-slate-900 rounded-2xl p-5 border border-slate-700">

          <p className="uppercase text-xs tracking-widest text-slate-400">

            Target

          </p>

          <h3 className="text-3xl font-bold text-white mt-2">

            {match.scorecard.target || "-"}

          </h3>

        </div>

        <div className="bg-slate-900 rounded-2xl p-5 border border-slate-700">

          <p className="uppercase text-xs tracking-widest text-slate-400">

            Current RR

          </p>

          <h3 className="text-3xl font-bold text-white mt-2">

            {match.scorecard.currentRunRate}

          </h3>

        </div>

      </div>

      {/* Result */}

      <div className="mt-8 rounded-2xl border border-cyan-500/20 bg-cyan-500/10 p-5">

        <p className="text-center text-cyan-300 font-semibold text-lg">

          {match.result}

        </p>

      </div>

      {/* Button */}

      <button className="group mt-8 w-full rounded-2xl bg-cyan-500 py-4 text-lg font-semibold text-slate-900 transition-all duration-300 hover:bg-cyan-400">

        <span className="flex items-center justify-center gap-3">

          View Live Match

          <FaArrowRight className="transition-transform duration-300 group-hover:translate-x-1"/>

        </span>

      </button>

    </div>
  );
}
export default MatchCard