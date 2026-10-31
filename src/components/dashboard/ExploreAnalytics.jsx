import { NavLink } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa6";

const destinations = [
  { label: "Players", description: "Browse player profiles", to: "/players" },
  { label: "Teams", description: "Explore international teams", to: "/teams" },
  { label: "Compare", description: "Compare player records", to: "/compare" },
  { label: "Analytics", description: "Explore cricket statistics", to: "/analytics" },
];

function ExploreAnalytics() {
  return (
    <section className="bg-[#111827] px-4 py-12 sm:px-6 sm:py-14 md:py-20">
      <div className="mx-auto w-full min-w-0 max-w-6xl">
        <div className="mb-7">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-400">
            Explore Criclyst
          </p>
          <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
            Cricket analytics
          </h2>
        </div>
        <div className="grid min-w-0 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {destinations.map(({ label, description, to }) => (
            <NavLink
              key={to}
              to={to}
              className="group flex min-h-20 min-w-0 items-center justify-between gap-3 rounded-2xl border border-slate-700 bg-slate-900/70 p-4 transition hover:border-cyan-400/70 hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-300 sm:p-5"
            >
              <span className="min-w-0">
                <span className="block break-words font-semibold text-white">{label}</span>
                <span className="mt-1 block break-words text-sm text-slate-400">
                  {description}
                </span>
              </span>
              <FaArrowRight className="shrink-0 text-cyan-400 transition-transform group-hover:translate-x-1" />
            </NavLink>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ExploreAnalytics;
