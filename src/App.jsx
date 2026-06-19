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
      runs: 234,
      role: "Bowler"
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
      />
    )
      })}
      
      
    </>
  )
}

export default App
