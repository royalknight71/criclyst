function PlayerCard({ name, runs, role , wickets}) {
  return (
    <div className="player-card">
      <h2>{name}</h2>
      {
            role === "Batsman"
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
            : role==="Bowler"
            ? "role-badge bowler"
            : "role-badge all-rounder"
        }>{role}</span>
    </div>
  );
}
export default PlayerCard