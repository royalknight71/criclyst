import { FaTrophy } from "react-icons/fa";
import { MdHistory } from "react-icons/md";

function EmptyRecentMatches() {
  return (
    <section className="bg-gradient-to-b from-slate-800 via-slate-900 to-[#0f172a] py-20">
      <div className="max-w-4xl mx-auto px-6">

        {/* Heading */}

        <div className="mb-10">

          <span className="text-cyan-400 uppercase tracking-widest text-sm font-semibold">
            MATCH HISTORY
          </span>

          <h2 className="mt-2 text-4xl font-bold text-white">
            Recent Matches
          </h2>

          <p className="mt-2 text-slate-400">
            Browse recently completed international matches.
          </p>

        </div>

        {/* Empty Card */}

        <div className="rounded-3xl border border-slate-700 bg-gradient-to-br from-slate-800 to-slate-900 p-12 text-center shadow-lg">

          <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full border border-cyan-500/30 bg-cyan-500/10">

            <FaTrophy className="text-5xl text-cyan-400" />

          </div>

          <h3 className="text-3xl font-bold text-white">
            No Recent Matches
          </h3>

          <p className="mx-auto mt-4 max-w-xl text-slate-400 leading-7">
            No completed matches are available right now.
            Match results, scorecards and player performances
            will appear here once games are completed.
          </p>

          <div className="my-8 h-px bg-slate-700"></div>

          <div className="inline-flex items-center gap-3 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-5 py-3">

            <MdHistory className="text-xl text-cyan-400" />

            <span className="font-medium text-cyan-300">
              Match history will appear here
            </span>

          </div>

        </div>

      </div>
    </section>
  );
}

export default EmptyRecentMatches;