import { useState } from 'react'
import '../App.css'
import { Link, NavLink } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import PlayerCard from "../components/PlayerCard.jsx"
import players from "../data/players"
import ComparisonSelector from "../components/ComparisonSelector.jsx"

function Home(){
  const [searchTerm,setsearchTerm]=useState("")
  const [selectedRole,setSelectedRole]=useState("All")
  const [player1,setPlayer1]=useState("")
  const [player2,setPlayer2]=useState("")

  const filterplayer=players.filter((player)=>{
  const matchSearch= player.name.toLowerCase().includes(searchTerm.toLowerCase())
  const matchRole=selectedRole==="All"||selectedRole===player.role

    return matchSearch&&matchRole
  })
  
    const player1Data = players.find(
      (player) => player.name === player1
    )

    const player2Data = players.find(
      (player) => player.name === player2
    )

    return (
        <>
        {/* <Navbar/> */}
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
      <br />
      <div className="analytics-preview">
        <h2>Analytics Dashboard</h2>

        <p>
          Explore player insights with interactive
          charts and visual statistics.
        </p>

        <NavLink to="/analytics" className="analytics-btn">
          View Analytics →
        </NavLink>
      </div>

      {filterplayer.length > 0 && (
     <ComparisonSelector   
          players={players}
        player1={player1}
        setPlayer1={setPlayer1}
        player2={player2}
        setPlayer2={setPlayer2}
        player1Data={player1Data}
        player2Data={player2Data}/> )}

        {
        filterplayer.length === 0
        ? <div>
          <h3>No Player Found</h3>
          <h4>Try searching another player.</h4>
          </div>
        : filterplayer.map((player) => {
          return (
           <PlayerCard
          key={player.name}
        name={player.name}
        image={player.image}
        runs={player.runs}
        role={player.role}
        wickets={player.wickets}
      />
    )
      })}
        </>
    )
}
export default Home