import { useParams , useNavigate } from "react-router-dom"
import players from "../data/players"
function PlayerDetails() {
  const params=useParams()
 const name=params.name
 const navigate=useNavigate()
  const player=players.find(
    (p)=>p.name.toLowerCase().replaceAll(" ", "-")===name
  )
  if (!player) {
  return <h1 className="player-name">Player Not Found</h1>
  }
      return (
    <div className="player-details-card">
      <div>
      <span className={
          player.role === "Batsman"
            ? "role-badge batsman"
            : player.role === "Wicket Keeper"
            ? "role-badge batsman"
            : player.role==="Bowler"
            ? "role-badge bowler"
            : "role-badge all-rounder"
        }>{player.role}</span>
        </div>
      <h1 className="player-name">{player.name}</h1>
      <br />
      <img className="player-image" src={player.image} alt={player.name} />
      <br />
      <div className="player-stats">
        {(player.role==="Batsman" || player.role==="Wicket Keeper")
        ? <div className="stat-row">
            <span className="stat-label">Runs</span>
            <span className="stat-value">{player.runs}</span>
          </div>
        : (player.role==="Bowler")
        ? <div className="stat-row">
            <span className="stat-label">Wickets</span>
            <span className="stat-value">{player.wickets}</span>
          </div>
      : (player.role==="All-Rounder")
      ? <div>
         <div className="stat-row">
          <span className="stat-label">Runs</span>
          <span className="stat-value">{player.runs}</span>
        </div>
        <div className="stat-row">
          <span className="stat-label">Wickets</span>
          <span className="stat-value">{player.wickets}</span>
        </div>
      </div>
      : <p></p>
      }
        <div className="stat-row">
        <span className="stat-label">Matches</span>
        <span className="stat-value">{player.matches}</span>
      </div>

        {
          <div className="stat-row">
          <span className="stat-label">
            {player.role === "Bowler"
              ? "Bowling Average"
              : "Batting Average"}
          </span>

          <span className="stat-value">{player.average}</span>
        </div>
        }

        {
          (player.role==="Batsman"||player.role==="Wicket Keeper"||player.role==="All-Rounder")
          ?
          <div className="stat-row">
          <span className="stat-label">Strike Rate</span>
          <span className="stat-value">{player.strikeRate}</span>
        </div>
        : null
        }
        {
          (player.role==="Batsman"||player.role==="Wicket Keeper"||player.role==="All-Rounder")
          ?
          <div className="stat-row">
            <span className="stat-label">Hundreds</span>
            <span className="stat-value">{player.hundred}</span>
          </div>
        : null
        }
        {
          (player.role==="Batsman"||player.role==="Wicket Keeper"||player.role==="All-Rounder")
          ?
          <div className="stat-row">
            <span className="stat-label">Fifties</span>
            <span className="stat-value">{player.fifty}</span>
          </div>
        : null
        }
        {
          (player.role==="Batsman"||player.role==="Wicket Keeper"||player.role==="All-Rounder")
          ?
          <div className="stat-row">
            <span className="stat-label">Highest Score</span>
            <span className="stat-value">{player.highestScore}</span>
          </div>
        : null
        }
        {
          (player.role==="Bowler"|| player.role==="All-Rounder")
          ?
          <div className="stat-row">
          <span className="stat-label">Economy Rate</span>
          <span className="stat-value">{player.economyRate}</span>
        </div>
        : null
        }
        {
          (player.role==="Bowler"|| player.role==="All-Rounder")
          ?
          <div className="stat-row">
            <span className="stat-label">Best Bowling</span>
            <span className="stat-value">{player.BBI}</span>
          </div>
        : null
        }
        
        <br />
                <button
        className="close-btn"
        onClick={() => {
            navigate("/")
        }}
        >
        ← Back to Players
        </button>
      </div>
    </div>
  );
}

export default PlayerDetails