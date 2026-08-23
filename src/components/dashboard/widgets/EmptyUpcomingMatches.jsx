/**
 * EmptyUpcomingMatches.jsx
 *
 * Placeholder section shown when no upcoming fixtures are scheduled.
 * Renders the "Upcoming Matches" heading with an empty-state card featuring
 * a calendar icon, explanatory text, and a stay-tuned badge.
 */

import { FaCalendarAlt } from "react-icons/fa";
import { FaClock } from "react-icons/fa6";

/**
 * EmptyUpcomingMatches component.
 *
 * @component
 * @returns {JSX.Element} The empty-state view for the upcoming matches section.
 */
function EmptyUpcomingMatches() {
  return (
    <section className="bg-gradient-to-b from-slate-800 via-slate-900 to-[#0f172a] py-20">
      <div className="max-w-4xl mx-auto px-6">

        {/* Heading */}

        <div className="mb-10">

          <span className="text-cyan-400 uppercase tracking-widest text-sm font-semibold">
            UPCOMING FIXTURES
          </span>

          <h2 className="mt-2 text-4xl font-bold text-white">
            Upcoming Matches
          </h2>

          <p className="mt-2 text-slate-400">
            Stay updated with upcoming international fixtures.
          </p>

        </div>

        {/* Empty Card */}

        <div className="rounded-3xl border border-slate-700 bg-gradient-to-br from-slate-800 to-slate-900 p-12 text-center shadow-lg">

          <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full border border-cyan-500/30 bg-cyan-500/10">

            <FaCalendarAlt className="text-5xl text-cyan-400" />

          </div>

          <h3 className="text-3xl font-bold text-white">
            No Upcoming Matches
          </h3>

          <p className="mx-auto mt-4 max-w-xl text-slate-400 leading-7">
            There are no scheduled matches at the moment.
            New fixtures will appear here as soon as they are announced.
          </p>

          <div className="my-8 h-px bg-slate-700"></div>

          <div className="inline-flex items-center gap-3 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-5 py-3">

            <FaClock className="text-cyan-400" />

            <span className="font-medium text-cyan-300">
              Stay tuned for upcoming fixtures
            </span>

          </div>

        </div>

      </div>
    </section>
  );
}

export default EmptyUpcomingMatches;