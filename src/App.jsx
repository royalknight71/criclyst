/**
 * Root application component.
 * Renders the shared layout (Navbar and Footer) around the routed page content.
 * Defines the top-level routes:
 *   /            - Home dashboard (live/upcoming/recent matches, stats, top players)
 *   /players     - Searchable, paginated player directory
 *   /players/:id - Detailed profile view for a single player
 *   /analytics   - Charts and visual insights into the squad
 *   /teams       - Team database with search and format filters
 *   /teams/:id   - Detailed profile view for a single team (with squad)
 */

import { Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import PlayerDetails from "./pages/PlayerDetails"
import Navbar from "./components/layout/Navbar"
import Analytics from "./pages/Analytics"
import Footer from "./components/layout/Footer";
import Players from "./pages/Players"
import Teams from "./pages/Teams"
import TeamDetails from "./pages/TeamDetails"

function App() {
  return (
    <>
    <Navbar/>
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path="/players" element={<Players />} />
      <Route path="/players/:id" element={<PlayerDetails />} />
      <Route path='/analytics' element={<Analytics/>}/>
      <Route path="/teams" element={<Teams />} />
      <Route path="/teams/:id" element={<TeamDetails />} />
    </Routes>
    <Footer />
    </>
  )
}

export default App
