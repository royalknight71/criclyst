import { useState } from 'react'
import '../App.css'
import players from "../data/players"
import PlayerCard from "../components/common/PlayerCard.jsx"

function Players(){
      const [searchTerm,setsearchTerm]=useState("")
      const [selectedRole,setSelectedRole]=useState("All")


    const filterplayer=players.filter((player)=>{
  const matchSearch= player.name.toLowerCase().includes(searchTerm.toLowerCase())
  const matchRole=selectedRole==="All"||selectedRole===player.role

    return matchSearch&&matchRole
  })
    return (
        <>
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
  filterplayer.length === 0 ? (
    <>
      <h3>No Player Found</h3>
      <h4>Try searching another player.</h4>
    </>
  ) : (
    filterplayer.map((player) => (
      <PlayerCard
        key={player.name}
        name={player.name}
        image={player.image}
        runs={player.runs}
        role={player.role}
        wickets={player.wickets}
      />
    ))
  )
}
        </>
    )
}

export default Players