import './App.css'
import PlayerCard from "./components/PlayerCard.jsx"
function App() {
  

  return (
    <>
      <h1>Criclyst</h1>
      <br />
      <h2>Top Players</h2>
      <br />
      {/* <h2>Rohit Sharma</h2>
      <h2>Virat Kohli</h2>
      <h2>Jasprit Bumrah</h2>
      <h2>Hardik Pandya</h2> */}
      <PlayerCard name="Rohit Sharma"/>
      <PlayerCard name="Virat Kohli"/>
      <PlayerCard name="Jasprit Bumrah"/>
      <PlayerCard name="Hardik Pandya"/>
    </>
  )
}

export default App
