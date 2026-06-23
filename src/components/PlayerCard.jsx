

function PlayerCard({ name,image, runs, role , wickets, economyRate,BBI, onClick}) {
  return (
    <div className="player-card" onClick={onClick}>
      <img src={image} alt={name} className="player-image" />

      <h2>{name}</h2>
      {
            role === "Batsman"
        ? <p>Runs: {runs}</p>
        : role === "Wicket Keeper"
        ? <p>Runs: {runs}</p>
        : role === "Bowler"
        ? <p>Wickets: {wickets}</p>
        : (
            <>
                <p>Runs: {runs}</p>
                <p>Wickets: {wickets}</p>
            </>
            )
        
      }
      <span className={
          role === "Batsman"
            ? "role-badge batsman"
            : role === "Wicket Keeper"
            ? "role-badge batsman"
            : role==="Bowler"
            ? "role-badge bowler"
            : "role-badge all-rounder"
        }>{role}</span>
    </div>
  );
}
export default PlayerCard