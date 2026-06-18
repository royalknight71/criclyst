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
      <PlayerCard
        name="Rohit Sharma"
        runs="11168"
        role="Batsman"
      />
      <PlayerCard name="Virat Kohli" runs="14085" role="Batsman"
      />
      <PlayerCard name="Jasprit Bumrah" runs="234" role="Bowler"
      />
      
    </>
  )
}

export default App
