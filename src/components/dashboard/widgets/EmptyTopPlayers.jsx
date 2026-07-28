import { FaTrophy } from "react-icons/fa";
import { IoPeople } from "react-icons/io5";

function EmptyTopPlayers() {
  return (
    <section className="bg-gradient-to-b from-slate-800 via-slate-900 to-[#0f172a] py-20">
      <div className="max-w-5xl mx-auto px-6">

        {/* Heading */}

        <div className="mb-10">

          <span className="text-cyan-400 uppercase tracking-widest text-sm font-semibold">
            TOP PLAYERS
          </span>

          <h2 className="mt-2 text-4xl font-bold text-white">
            Top Performers
          </h2>

          <p className="mt-2 text-slate-400">
            Discover the highest-performing players across international cricket.
          </p>

        </div>

        {/* Empty Card */}

        <div className="rounded-3xl border border-slate-700 bg-gradient-to-br from-slate-800 to-slate-900 p-12 text-center shadow-lg">

          <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full border border-cyan-500/30 bg-cyan-500/10">

            <FaTrophy className="text-5xl text-cyan-400" />

          </div>

          <h3 className="text-3xl font-bold text-white">
            No Top Players Found
          </h3>

          <p className="mx-auto mt-4 max-w-xl leading-7 text-slate-400">
            Player rankings are currently unavailable.
            Once player statistics are added, the highest-performing
            cricketers will be displayed here.
          </p>

          <div className="my-8 h-px bg-slate-700"></div>

          <div className="inline-flex items-center gap-3 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-5 py-3">

            <IoPeople className="text-xl text-cyan-400" />

            <span className="font-medium text-cyan-300">
              Rankings will appear here
            </span>

          </div>

        </div>

      </div>
    </section>
  );
}

export default EmptyTopPlayers;