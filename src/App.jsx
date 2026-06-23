import { useState } from 'react'
import './App.css'
import PlayerCard from "./components/PlayerCard.jsx"
import players from "./data/players"
import InsidePlayerCard from './components/InsidePlayerCard.jsx'
function App() {

  const [searchTerm,setsearchTerm]=useState("")
  const [selectedRole,setSelectedRole]=useState("All")
  const [selectedPlayer, setSelectedPlayer]=useState(null)
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
    const isBowlerComparison =
    player1Data?.role === "Bowler" ||
    player2Data?.role === "Bowler"

    const showWickets =
  ["Bowler","All-Rounder"].includes(player1Data?.role) &&
  ["Bowler","All-Rounder"].includes(player2Data?.role)

      let player1WinsRuns = false
      let player2WinsRuns = false
      let player1WinAvg=false
      let player2WinAvg=false
      let player1SR=false
      let player2SR=false
      let player1MatchWin = false
      let player2MatchWin = false
      let player1WktWin=false
      let player2WktWin=false
      let player1ecoWin=false
      let player2ecoWin=false
      if(player1Data && player2Data)
      {
        player1WinsRuns = player1Data.runs > player2Data.runs
        player2WinsRuns = player2Data.runs > player1Data.runs
        player1WktWin = player1Data.wickets > player2Data.wickets
        player2WktWin = player2Data.wickets > player1Data.wickets
        player1WinAvg=player1Data.average>player2Data.average
        player2WinAvg=player1Data.average<player2Data.average
        player1SR=player1Data.strikeRate>player2Data.strikeRate
        player2SR=player1Data.strikeRate<player2Data.strikeRate
          player1MatchWin = player1Data.matches > player2Data.matches
          player2MatchWin = player1Data.matches < player2Data.matches
        player1ecoWin = player1Data.economyRate<player2Data.economyRate
        player2ecoWin = player2Data.economyRate < player1Data.economyRate
      }
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
      <br />
      <div className="compare-container">
        <h2>Player Comparison</h2>
        <select name="player1comp" id="player1comp"
        value={player1}
        onChange={(e)=>{
          setPlayer1(e.target.value)
        }}
        >
          <option value="">
            Select Player 1
          </option>
          {players.map((player) => (
              <option key={player.name} value={player.name}>
                {player.name}
              </option>
            ))}
        </select>
        <select name="player2comp" id="player2comp"
        value={player2}
        onChange={(e)=>{
          setPlayer2(e.target.value)
        }}
        > 
          <option value="">
            Select Player 2
          </option>
          {
            players.map((player)=>(
              <option key={player.name} value={player.name}>
                {player.name}
              </option>
            ))
          }
        </select>
      </div>
      <div>
        {
        (player1Data && player2Data)
        ? 
        <div className="comparison-card">
          <div className="compare-title">
            <span>{player1Data.name}</span>
            <span className="vs-text">VS</span>
            <span>{player2Data.name}</span>
          </div>
        
        {
          <div className="comparison-row">
          <span>Runs</span>

          <span>
            {player1Data.runs}
            {player1WinsRuns && <span className="winner-dot"></span>}
          </span>

          <span>
            {player2Data.runs}
            {player2WinsRuns && <span className="winner-dot"></span>}
          </span>
        </div>
        }

        {
          (showWickets)
          ? <div className="comparison-row">
          <span>Wickets</span>

          <span>
            {player1Data.wickets}
            {player1WktWin && <span className="winner-dot"></span>}
          </span>

          <span>
            {player2Data.wickets}
            {player2WktWin && <span className="winner-dot"></span>}
          </span>
        </div>
        : <p></p>  
      }

          <div className="comparison-row">
            <span>Matches</span>
            <span>{player1Data.matches}
              {player1MatchWin && <span className="winner-dot"></span>}
            </span>
            <span>{player2Data.matches}
              {player2MatchWin && <span className="winner-dot"></span>}
            </span>
          </div>

          <div className="comparison-row">
            <span>Average</span>
            
            <span>{player1Data.average}
              {player1WinAvg&&<span className="winner-dot"></span>}
            </span>
            <span>{player2Data.average}
              {player2WinAvg&&<span className="winner-dot"></span>}
            </span>
          </div>
          {
          (showWickets)
          ? <div className="comparison-row">
          <span>Economy Rate</span>

          <span>
            {player1Data.economyRate}
            {player1ecoWin && <span className="winner-dot"></span>}
          </span>

          <span>
            {player2Data.economyRate}
            {player2ecoWin && <span className="winner-dot"></span>}
          </span>
        </div>
        : <p></p>  
      }
      {
          (showWickets)
          ? <div className="comparison-row">
          <span>Best Bowling(Innings)</span>

          <span>
            {player1Data.BBI}
          </span>

          <span>
            {player2Data.BBI}
          </span>
        </div>
        : <p></p>  
      }
          {
            ((player1Data.role==="Bowler"&&player2Data.role==="Bowler")||
          isBowlerComparison
        )
            ? <p></p>
            : <div className="comparison-row">
            <span>Strike Rate</span>
            <span>{player1Data.strikeRate}
              {player1SR&&<span className="winner-dot"></span>}
            </span>
            <span>{player2Data.strikeRate}
              {player2SR&&<span className="winner-dot"></span>}
            </span>
          </div>}
          <p>*Average denotes to Bowling Average if the player is Bowler otherwise it is Batting Average</p>
        </div>
        : <p></p>
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
