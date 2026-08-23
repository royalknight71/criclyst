/**
 * ComparisonSelector.jsx
 *
 * Provides the player comparison interface: two dropdown selectors to
 * pick the players to compare, plus a rendered ComparisonCard once both
 * players' data is available.
 */

import ComparisonCard from "./ComparisonCard"

/**
 * Renders the player selection controls and comparison result.
 * @param {object} props - Component props.
 * @param {Array<{name: string}>} props.players - List of available players for the dropdowns.
 * @param {string} props.player1 - Currently selected first player's name.
 * @param {function(string): void} props.setPlayer1 - Setter for the first player's selection.
 * @param {string} props.player2 - Currently selected second player's name.
 * @param {function(string): void} props.setPlayer2 - Setter for the second player's selection.
 * @param {object|null} props.player1Data - Loaded stats object for player 1, or null if not selected/loaded.
 * @param {object|null} props.player2Data - Loaded stats object for player 2, or null if not selected/loaded.
 * @returns {JSX.Element} The comparison selector element.
 */
function ComparisonSelector({
            players,
            player1,
            setPlayer1,
            player2,
            setPlayer2,
            player1Data,
            player2Data
            }){
    return (<div className="compare-container">
        <h2>Player Comparison</h2>
        <p>Compare two Team India players side by side.</p>
        <br />
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
      {
        player1Data && player2Data && (
          <ComparisonCard
            player1Data={player1Data}
            player2Data={player2Data}
          />
        )
      }
      </div>)
}
export default ComparisonSelector