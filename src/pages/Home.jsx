
import Hero from "../components/dashboard/Hero";
import HeroDashboard from "../components/dashboard/HeroDashboard"
import StatsCards from "../components/dashboard/StatsCards";
import LiveMatches from "../components/dashboard/LiveMatches";
import UpcomingMatches from "../components/dashboard/UpcomingMatches";
import RecentMatches from "../components/dashboard/RecentMatches";
import TopPlayers from "../components/dashboard/TopPlayers";

function Home() {
  return (
    <>
      <Hero />
      <HeroDashboard />
      <StatsCards />
      <LiveMatches />
      <UpcomingMatches />
      <RecentMatches />
      <TopPlayers />
    </>
  );
}

export default Home;