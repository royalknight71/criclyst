import PlayerCard from "./PlayerCard";

function InsidePlayerCard({ player ,setSelectedPlayer})
{
      return (
    <div className="player-card">
      <h2>{player.name}</h2>

        <p>Runs: {player.runs}</p>

        <p>Matches: {player.matches}</p>

        <p>Average: {player.average}</p>

        <p>Strike Rate: {player.strikeRate}</p>

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