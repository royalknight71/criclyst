import { Routes, Route } from "react-router-dom"
import { AuthProvider } from "./context/AuthContext"
import Home from "./pages/Home"
import PlayerDetails from "./pages/PlayerDetails"
import Navbar from "./components/layout/Navbar"
import Analytics from "./pages/Analytics"
import Footer from "./components/layout/Footer";
import Players from "./pages/Players"
import Teams from "./pages/Teams"
import TeamDetails from "./pages/TeamDetails"
import Matches from "./pages/Matches"
import MatchDetails from "./pages/MatchDetails"
import Compare from "./pages/Compare"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Favorites from "./pages/Favorites"
import AdminDashboard from "./pages/AdminDashboard"
import AdminPlayers from "./pages/AdminPlayers"
import AdminTeams from "./pages/AdminTeams"
import AdminMatches from "./pages/AdminMatches"
import LiveScores from "./pages/LiveScores"
import LiveMatchDetails from "./pages/LiveMatchDetails"
import ProtectedRoute from "./components/common/ProtectedRoute"
import AdminRoute from "./components/common/AdminRoute"

function App() {
  return (
    <AuthProvider>
    <Navbar/>
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path="/players" element={<Players />} />
      <Route path="/players/:id" element={<PlayerDetails />} />
      <Route path='/analytics' element={<Analytics/>}/>
      <Route path="/teams" element={<Teams />} />
      <Route path="/teams/:id" element={<TeamDetails />} />
      <Route path="/matches" element={<Matches />} />
      <Route path="/matches/:id" element={<MatchDetails />} />
      <Route path="/live-scores" element={<LiveScores />} />
      <Route path="/live/:matchId" element={<LiveMatchDetails />} />
      <Route path="/compare" element={<Compare />} />
      <Route path="/favorites" element={<ProtectedRoute><Favorites /></ProtectedRoute>} />
      <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
      <Route path="/admin/players" element={<AdminRoute><AdminPlayers /></AdminRoute>} />
      <Route path="/admin/teams" element={<AdminRoute><AdminTeams /></AdminRoute>} />
      <Route path="/admin/matches" element={<AdminRoute><AdminMatches /></AdminRoute>} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="*" element={
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
          <h1 className="text-6xl font-black text-white mb-4">404</h1>
          <p className="text-xl text-slate-400 mb-8">Page not found</p>
          <a href="/" className="rounded-xl bg-cyan-500 px-6 py-3 font-semibold text-white transition hover:bg-cyan-400">
            Go Home
          </a>
        </div>
      } />
    </Routes>
    <Footer />
    </AuthProvider>
  )
}

export default App
