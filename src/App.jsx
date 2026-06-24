import { Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import About from "./pages/About"
import PlayerDetails from "./pages/PlayerDetails"
import Navbar from "./components/Navbar"
function App() {
  return (
    <>
    <Navbar/>
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/about' element={<About/>}/>
      <Route path='/player/:name' element={<PlayerDetails/>}/>
    </Routes>
    </>
  )
}

export default App
