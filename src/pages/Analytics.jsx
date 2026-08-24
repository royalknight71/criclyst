/**
 * Analytics page (route: /analytics).
 *
 * Global cricket analytics dashboard powered by the backend analytics
 * endpoint (GET /players/analytics). All statistics are computed in
 * the database — no hardcoded data.
 *
 * Sections:
 *   - Overview stat cards (total players/countries + role breakdown)
 *   - Top 5 leaderboards: runs, wickets, batting average, strike rate
 *   - Country-wise player distribution chart
 *   - Role distribution donut chart
 *   - Interactive Country/Role filters that re-fetch every metric
 *
 * States: skeleton loading, themed API-error panel and an empty-data
 * state when the database has no players.
 */

import { useEffect, useState } from "react";
import { FaUsers, FaGlobe, FaStar, FaUserShield } from "react-icons/fa";
import { GiCricketBat } from "react-icons/gi";
import { TbTargetArrow } from "react-icons/tb";
import AnalyticsBarChart from "../components/analytics/AnalyticsBarChart";
import AnalyticsFilters from "../components/analytics/AnalyticsFilters";
import RolePieChart from "../components/analytics/RolePieChart";
import SummaryCard from "../components/common/SummaryCard";
import EmptyPlayers from "../components/dashboard/widgets/EmptyPlayers";
import { getPlayerAnalytics } from "../services/analytics.service";
import { toTitleCase } from "../utils/format";

/** Pie slice colors for the role distribution donut. */
const ROLE_COLORS = ["#0088FE", "#ae3333", "#29ce60", "#FF8042"];

/** Icon lookup for dynamically returned roles. */
const ROLE_ICONS = {
  Batsman: <GiCricketBat />,
  Bowler: <TbTargetArrow />,
  "All-Rounder": <FaStar />,
  "All Rounder": <FaStar />,
  "Wicket-Keeper": <FaUserShield />,
  "Wicket Keeper": <FaUserShield />,
};

/**
 * Renders the global analytics dashboard.
 * Fetches aggregated analytics on mount and whenever the country or
 * role filters change; snapshots the available filter options from the
 * first unfiltered response so dropdowns keep all choices.
 *
 * @returns {JSX.Element} The analytics dashboard UI.
 */
function Analytics() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [countryFilter, setCountryFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState("");

  const [filterOptions, setFilterOptions] = useState({
    countries: [],
    roles: [],
  });

  useEffect(() => {
    let cancelled = false;

    const fetchAnalytics = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await getPlayerAnalytics(countryFilter, roleFilter);

        if (cancelled) return;

        setAnalytics(data);

        /* Snapshot filter options from an unfiltered response only,
           so dropdowns always list every database value. */
        if (!countryFilter && !roleFilter) {
          setFilterOptions({
            countries: data.countryDistribution.map((item) => item.country),
            roles: data.roleDistribution.map((item) => item.role),
          });
        }
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchAnalytics();

    return () => {
      cancelled = true;
    };
  }, [countryFilter, roleFilter]);

  /** Clears both filters back to the global view. */
  const handleResetFilters = () => {
    setCountryFilter("");
    setRoleFilter("");
  };

  /**
   * Applies display formatting (Title Case) to chart labels without
   * touching the underlying API values.
   */
  const formatLeaderboard = (entries) =>
    entries.map((entry) => ({
      ...entry,
      name: toTitleCase(entry.name),
    }));

  /* Overview cards built from live database values. */
  const overviewCards = analytics
    ? [
        {
          title: "Players",
          value: analytics.overview.totalPlayers,
          icon: <FaUsers />,
        },
        {
          title: "Countries",
          value: analytics.overview.totalCountries,
          icon: <FaGlobe />,
        },
        ...analytics.roleDistribution.map((item) => ({
          title: item.role.replace("-", " "),
          value: item.count,
          icon: ROLE_ICONS[item.role] ?? <FaUsers />,
        })),
      ]
    : [];

  return (
    <section className="relative min-h-screen overflow-hidden bg-[#0B1120]">
      {/* Background glow */}
      <div className="absolute left-0 top-20 h-96 w-96 rounded-full bg-cyan-500/10 blur-[120px]" />
      <div className="absolute right-0 top-40 h-96 w-96 rounded-full bg-purple-500/10 blur-[120px]" />

      <div className="relative mx-auto max-w-[1400px] px-6 py-16 sm:px-10 lg:px-12">
        {/* Header */}
        <div className="text-center">
          <p className="text-cyan-400 font-semibold tracking-[0.3em] uppercase">
            CRICKET ANALYTICS
          </p>

          <h1 className="mt-4 text-5xl font-black leading-tight text-white">
            Analytics{" "}
            <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
              Dashboard
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-400">
            Visual insights across every player in the Criclyst database
          </p>
        </div>

        {loading ? (
          /* Loading skeletons */
          <div className="mt-14 space-y-10">
            <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="
                    h-40 animate-pulse rounded-2xl border border-slate-800
                    bg-[#111827]
                  "
                />
              ))}
            </div>

            {[1, 2].map((row) => (
              <div key={row} className="grid gap-8 lg:grid-cols-2">
                {Array.from({ length: row === 1 ? 1 : 2 }).map((_, index) => (
                  <div
                    key={index}
                    className="
                      h-[380px] animate-pulse rounded-3xl border
                      border-slate-800 bg-[#111827]
                    "
                  />
                ))}
              </div>
            ))}
          </div>
        ) : error ? (
          /* API error state */
          <div className="mx-auto mt-14 max-w-xl rounded-3xl border border-red-500/30 bg-red-500/5 p-10 text-center">
            <h2 className="text-2xl font-bold text-white">
              Failed to load analytics.
            </h2>
            <p className="mt-3 text-slate-400">{error}</p>
          </div>
        ) : !analytics || analytics.overview.totalPlayers === 0 ? (
          /* Empty database state */
          <div className="mt-14">
            <EmptyPlayers />
          </div>
        ) : (
          <>
            {/* Filters */}
            <div className="mt-12">
              <AnalyticsFilters
                country={countryFilter}
                role={roleFilter}
                countries={filterOptions.countries}
                roles={filterOptions.roles}
                onCountryChange={setCountryFilter}
                onRoleChange={setRoleFilter}
                onReset={handleResetFilters}
              />
            </div>

            {/* Overview stat cards */}
            <div className="mt-10 grid gap-5 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6">
              {overviewCards.map((card) => (
                <SummaryCard
                  key={card.title}
                  icon={card.icon}
                  title={card.title}
                  value={card.value}
                />
              ))}
            </div>

            {/* Charts */}
            <div className="mt-16 space-y-10">
              <AnalyticsBarChart
                title="Top Run Scorers"
                data={formatLeaderboard(analytics.topRunScorers)}
                dataKey="runs"
                namekey="name"
                color="#6C63FF"
                name="Runs"
              />

              <AnalyticsBarChart
                title="Top Wicket Takers"
                data={formatLeaderboard(analytics.topWicketTakers)}
                dataKey="wickets"
                namekey="name"
                color="#de2929"
                name="Wickets"
              />

              <div className="grid gap-8 lg:grid-cols-2">
                <AnalyticsBarChart
                  title="Highest Batting Average"
                  data={formatLeaderboard(analytics.topBattingAverages)}
                  dataKey="average"
                  namekey="name"
                  color="#146876"
                  name="Average"
                />

                <AnalyticsBarChart
                  title="Highest Strike Rate"
                  data={formatLeaderboard(analytics.topStrikeRates)}
                  dataKey="strikeRate"
                  namekey="name"
                  color="#761452"
                  name="Strike Rate"
                />
              </div>

              <div className="grid gap-8 xl:grid-cols-2">
                <AnalyticsBarChart
                  title="Country-wise Player Distribution"
                  data={analytics.countryDistribution.map((item) => ({
                    ...item,
                    country: toTitleCase(item.country),
                  }))}
                  dataKey="count"
                  namekey="country"
                  color="#0ea5e9"
                  name="Players"
                />

                <RolePieChart
                  title="Role Distribution"
                  data={analytics.roleDistribution.map((item) => ({
                    ...item,
                    role: item.role.replace("-", " "),
                  }))}
                  dataKey="count"
                  nameKey="role"
                  COLORS={ROLE_COLORS}
                  innerRadius={55}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

export default Analytics;
