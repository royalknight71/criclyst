import './App.css'
import PlayerCard from "./components/PlayerCard.jsx"
function App() {
  const players=[
    {
    name: "Rohit Sharma",
    runs: 11168,
    role: "Batsman"
    },
    {
      name: "Virat Kohli",
      runs: 14085,
      role: "Batsman"
    },
    {
      name: "Jasprit Bumrah",
      wickets: 450,
      role: "Bowler"
    },
    {
      name: "Hardik Pandya",
      runs: 3850,
      wickets: 190,
      role: "All-Rounder"
    }
  ]

  return (
    <>
      <h1>Criclyst</h1>
      <br />
      <h2>Top Players</h2>
      <br />
      
        {players.map((player)=>{
          return (<PlayerCard
          key={player.name}
        name={player.name}
        runs={player.runs}
        role={player.role}
        wickets={player.wickets}
      />
    )
      })}
      
      
    </>
  )
}

export default App
