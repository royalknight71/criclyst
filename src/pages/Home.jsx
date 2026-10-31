import Hero from "../components/dashboard/Hero";
import LiveMatches from "../components/dashboard/LiveMatches";
import UpcomingMatches from "../components/dashboard/UpcomingMatches";
import RecentMatches from "../components/dashboard/RecentMatches";
import ExploreAnalytics from "../components/dashboard/ExploreAnalytics";

function Home() {
  return (
    <main>
      <Hero />
      <LiveMatches />
      <UpcomingMatches />
      <RecentMatches />
      <ExploreAnalytics />
    </main>
  );
}

export default Home;
