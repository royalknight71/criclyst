/**
 * Compare page.
 *
 * Lets the user pick two players from the local static dataset and
 * view them side by side. State:
 *   - player1 / player2: currently selected player names (empty until chosen).
 * The selected names are resolved against the static `players` array,
 * and once both selections exist a ComparisonCard is rendered with
 * head-to-head stats. Selection inputs are handled by ComparisonSelector.
 */

import players from "../data/players"
import ComparisonSelector from "../components/compare/ComparisonSelector.jsx"
import { useState } from 'react'
import '../App.css'
import ComparisonCard from "../components/compare/ComparisonCard";

/**
 * Renders the player comparison UI.
 *
 * @returns {JSX.Element} Selector for choosing two players, plus the
 *   comparison card once both players are selected.
 */
function Compare(){
    const [player1,setPlayer1]=useState("")
  const [player2,setPlayer2]=useState("")

//   const filterplayer=players.filter((player)=>{
//   const matchSearch= player.name.toLowerCase().includes(searchTerm.toLowerCase())
//   const matchRole=selectedRole==="All"||selectedRole===player.role

//     return matchSearch&&matchRole
//   })
  
    const player1Data = players.find(
      (player) => player.name === player1
    )

    const player2Data = players.find(
      (player) => player.name === player2
    )

    return (
        <>
     <ComparisonSelector   
        players={players}
        player1={player1}
        setPlayer1={setPlayer1}
        player2={player2}
        setPlayer2={setPlayer2}
        player1Data={player1Data}
        player2Data={player2Data}/>

        
     {
  player1Data && player2Data && (
    <ComparisonCard
      player1={player1Data}
      player2={player2Data}
    />
  )

    //       player1Data && player2Data && (
    //        <PlayerCard
    //       key={player.name}
    //     name={player.name}
    //     image={player.image}
    //     runs={player.runs}
    //     role={player.role}
    //     wickets={player.wickets}
    //   />
    // )
      }
        </>
    )
}

export default Compare