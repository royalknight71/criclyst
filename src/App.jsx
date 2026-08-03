import { Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import PlayerDetails from "./pages/PlayerDetails"
import Navbar from "./components/layout/Navbar"
import Analytics from "./pages/Analytics"
import Footer from "./components/layout/Footer";
import Players from "./pages/Players"
function App() {
  return (
    <>
    <Navbar/>
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path="/players" element={<Players />} />
      <Route path="/players/:id" element={<PlayerDetails />} />
      <Route path='/analytics' element={<Analytics/>}/>
    </Routes>
    <Footer />
    </>
  )
}

export default App
