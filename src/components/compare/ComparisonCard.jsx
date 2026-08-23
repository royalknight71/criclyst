/**
 * ComparisonCard.jsx
 *
 * Displays a head-to-head statistical comparison between two players.
 * Computes win indicators for each metric (runs, wickets, matches,
 * average, strike rate, hundreds, fifties, economy rate) and renders a
 * "winner dot" next to the better value. Rows are conditionally shown
 * based on the players' roles: batting-only rows are hidden when either
 * player is a Bowler, while bowling rows appear only when both players
 * bowl (Bowler or All-Rounder).
 */

/**
 * Renders the side-by-side comparison table for two selected players.
 * @param {object} props - Component props.
 * @param {object|null} props.player1Data - Stats object for the first player, or null if not yet selected.
 * @param {string} props.player1Data.name - First player's name.
 * @param {string} props.player1Data.role - First player's role (Batsman, Bowler, All-Rounder, etc.).
 * @param {number} props.player1Data.runs - Total runs scored.
 * @param {number} props.player1Data.wickets - Total wickets taken.
 * @param {number} props.player1Data.matches - Matches played.
 * @param {number} props.player1Data.average - Batting or bowling average.
 * @param {number} props.player1Data.strikeRate - Batting strike rate.
 * @param {number} props.player1Data.hundred - Number of centuries.
 * @param {number} props.player1Data.fifty - Number of half-centuries.
 * @param {number|string} props.player1Data.highestScore - Highest individual score.
 * @param {number} props.player1Data.economyRate - Bowling economy rate.
 * @param {string} props.player1Data.BBI - Best bowling in an innings.
 * @param {object|null} props.player2Data - Stats object for the second player (same shape as player1Data), or null if not yet selected.
 * @returns {JSX.Element} The comparison card element, or empty paragraph if data is missing.
 */
function ComparisonCard({
        player1Data,
        player2Data,
        }){

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
      let player1hund=false
      let player2hund=false
    let player1fifty=false
      let player2fifty=false
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
        player1hund=player1Data.hundred>player2Data.hundred
        player2hund=player1Data.hundred<player2Data.hundred
        player1fifty=player1Data.fifty>player2Data.fifty
        player2fifty=player1Data.fifty<player2Data.fifty
      }
    return(
        <div>
        {
        (player1Data&&player2Data)
        ? 
        <div className="comparison-card">
          <div className="compare-title">
            <span className="compare-player-name">{player1Data.name}</span>
            <span className="vs-text">VS</span>
            <span className="compare-player-name">{player2Data.name}</span>
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
            <span>Average*</span>
            
            <span>{player1Data.average}
              {player1WinAvg&&<span className="winner-dot"></span>}
            </span>
            <span>{player2Data.average}
              {player2WinAvg&&<span className="winner-dot"></span>}
            </span>
          </div>
                    {
            (isBowlerComparison)
            ? null
            : <div className="comparison-row">
            <span>Strike Rate</span>
            <span>{player1Data.strikeRate}
              {player1SR&&<span className="winner-dot"></span>}
            </span>
            <span>{player2Data.strikeRate}
              {player2SR&&<span className="winner-dot"></span>}
            </span>
          </div>}
          {
            (isBowlerComparison)
            ? null
            : <div className="comparison-row">
            <span>Hundreds</span>
            <span>{player1Data.hundred}
              {player1hund&&<span className="winner-dot"></span>}
            </span>
            <span>{player2Data.hundred}
              {player2hund&&<span className="winner-dot"></span>}
            </span>
          </div>}
          {
            (isBowlerComparison)
            ? null
            : <div className="comparison-row">
            <span>Fifties</span>
            <span>{player1Data.fifty}
              {player1fifty&&<span className="winner-dot"></span>}
            </span>
            <span>{player2Data.fifty}
              {player2fifty&&<span className="winner-dot"></span>}
            </span>
          </div>}
          {
            (isBowlerComparison)
            ? null
            : <div className="comparison-row">
            <span>Highest Score</span>
            <span>{player1Data.highestScore}
              
            </span>
            <span>{player2Data.highestScore}
              
            </span>
          </div>}
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
          <p className="comment-about-avg">*Average denotes to Bowling Average if the player is Bowler otherwise it is Batting Average</p>
        </div>
        : <p></p>
      }
      </div>
    )
}

export default ComparisonCard