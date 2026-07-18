import ComparisonCard from "./ComparisonCard"

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