import { useState } from 'react'
import './App.css'
import PlayerCard from "./components/PlayerCard.jsx"
import players from "./data/players"
import InsidePlayerCard from './components/InsidePlayerCard.jsx'
function App() {

  const [searchTerm,setsearchTerm]=useState("")
  const [selectedRole,setSelectedRole]=useState("All")
  const [selectedPlayer, setSelectedPlayer]=useState(null)
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
        {(selectedPlayer === null)
        ? <p>Showing {filterplayer.length} Players</p>
          :<p></p>
      }
      </div>
      {
      (filterplayer.length===0)
      ? <h3>No Player Found</h3>
       : selectedPlayer
       ?<InsidePlayerCard 
         player={selectedPlayer}
        setSelectedPlayer={setSelectedPlayer}
       />
       : filterplayer.map((player)=>{
          return (
           <PlayerCard
          key={player.name}
        name={player.name}
        image={player.image}
        runs={player.runs}
        role={player.role}
        wickets={player.wickets}
          onClick={() => {
          setSelectedPlayer(player)
        }}
      />
    )
      })}
      
      
    </>
  )
}

export default App
