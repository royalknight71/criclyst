import PlayerCard from "./PlayerCard";
import players from "../data/players";
function InsidePlayerCard({ player ,setSelectedPlayer})
{
      return (
    <div className="player-card">
      <h2>{player.name}</h2>
        {(player.role==="Batsman" || player.role==="Wicket Keeper")
        ? <p>Runs: {player.runs}</p>
        : (player.role==="Bowler")
        ? <p>Wickets: {player.wickets}</p>
      : (player.role==="All-Rounder")
      ? <div>
         <p>Runs: {player.runs}</p>
        <p>Wickets: {player.wickets}</p>
      </div>
      : <p></p>
      }
        <p>Matches: {player.matches}</p>

        {
          (player.role==="Batsman"||player.role==="Wicket Keeper"||player.role==="All-Rounder")
          ?<p>Batting Average: {player.average}</p>
        : <p>Bowling Average: {player.average}</p>
        }

        {
          (player.role==="Batsman"||player.role==="Wicket Keeper"||player.role==="All-Rounder")
          ?
          <p>Strike Rate: {player.strikeRate}</p>
        : <p></p>
        }
        {
          (player.role==="Bowler"|| player.role==="All-Rounder")
          ?
          <p>Economy Rate: {player.economyRate}</p>
        : <p></p>
        }
        {
          (player.role==="Bowler"|| player.role==="All-Rounder")
          ?
          <p>Best Bowling(Innings): {player.BBI}</p>
        : <p></p>
        }
        <p>Role: {player.role}</p>
                <button
        className="close-btn"
        onClick={() => {
            setSelectedPlayer(null)
        }}
        >
        ← Back to Players
        </button>
    </div>
  );
}

export default InsidePlayerCard