import { useState } from 'react'
import './App.css'
import PlayerCard from "./components/PlayerCard.jsx"
import players from "./data/players"
function App() {

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
      <div className='player-size'>
        <p>Showing {filterplayer.length} Players</p>
      </div>
      {
      (filterplayer.length===0)
      ? <p>No Player Found</p>
       : filterplayer.map((player)=>{
          return (
           <PlayerCard
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
