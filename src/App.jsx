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
import ProtectedRoute from "./components/common/ProtectedRoute"

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
      <Route path="/compare" element={<Compare />} />
      <Route path="/favorites" element={<ProtectedRoute><Favorites /></ProtectedRoute>} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
    <Footer />
    </AuthProvider>
  )
}

export default App
