import PlayerCard from "./PlayerCard";

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
      : <p>Hello</p>
      }
        <p>Matches: {player.matches}</p>

        <p>Average: {player.average}</p>

        <p>Strike Rate: {player.strikeRate}</p>
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