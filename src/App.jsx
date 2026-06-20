import { useState } from 'react'
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
    },
    {
      name: "Ishan Kishan",
      runs: 1092,
      role: "Wicket Keeper"
    },
    {
      name: "Shubhman Gill",
      runs: 3191,
      role: "Batsman"
    },
    {
      name: "Shreyas Iyer",
      runs: 3015,
      role: "Batsman"
    },
    {
      name: "Mohammad Shami",
      wickets: 206,
      role: "Bowler"
    },
    {
      name: "Axar Patel",
      runs: 858,
      wickets: 75,
      role: "All-Rounder"
    },
    {
      name: "KL Rahul",
      runs: 3399,
      role: "Wicket Keeper"
    },
    {
      name: "Varun Chakravarthy",
      wickets: 10,
      role: "Bowler"
    },
    {
      name: "Ravindra Jadeja",
      runs: 2905,
      wickets: 232,
      role: "All-Rounder"
    }

  ]

  const [searchTerm,setsearchTerm]=useState("")
  const [selectedRole,setSelectedRole]=useState("All")
  const filterplayer=players.filter((player)=>{
    const matchSearch= player.name.toLowerCase().includes(searchTerm.toLowerCase())

    const matchRole=selectedRole==="All"||selectedRole===player.role

    return matchSearch&&matchRole
  })
  
  
  return (
    <>
      <h1>Criclyst</h1>
      <br />
      <h2>Team India ODI Squad</h2>
      <br />
      <div className="search-container">
        <input
          type="text"
          placeholder="Search Player..."
          className="search-box"
          value={searchTerm}
          onChange={(e)=>{
            setsearchTerm(e.target.value)
          }}
        />
      </div>
      <div className="filter-container">
        <select name="all-players" id="all-players" className="role-filter"
        value={selectedRole}
        onChange={(e)=>{
          setSelectedRole(e.target.value)
        }}>
          <option value="All">All Players</option>
          <option value="Batsman">Batsman</option>
          <option value="Bowler">Bowler</option>
          <option value="All-Rounder">All-Rounder</option>
          <option value="Wicket Keeper">Wicket Keeper</option>
        </select>
      </div>
        {filterplayer.map((player)=>{
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
