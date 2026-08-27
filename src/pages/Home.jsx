/**
 * Home page (route: /).
 *
 * The main landing dashboard. Composes the marketing hero, an
 * interactive dashboard hero, aggregate stats cards and match/player
 * sections (live, upcoming and recent matches plus top players).
 * Each child component fetches its own data via the service layer.
 */

import Hero from "../components/dashboard/Hero";
import HeroDashboard from "../components/dashboard/HeroDashboard"
import StatsCards from "../components/dashboard/StatsCards";
import LiveMatches from "../components/dashboard/LiveMatches";
import UpcomingMatches from "../components/dashboard/UpcomingMatches";
import RecentMatches from "../components/dashboard/RecentMatches";
import PerformanceHighlights from "../components/dashboard/widgets/PerformanceHighlights";

/**
 * Renders the full home dashboard layout.
 *
 * @returns {JSX.Element} Stacked dashboard sections (hero, stats,
 *   matches, top players) wrapped in a single container.
 */
function Home() {
  return (
    <div>
      <Hero />
      <HeroDashboard />
      <StatsCards />
      <LiveMatches />
      <UpcomingMatches />
      <RecentMatches />
      <PerformanceHighlights />
    </div>
  );
}

export default Home;