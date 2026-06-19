function PlayerCard({ name, runs, role }) {
  return (
    <div className="player-card">
      <h2>{name}</h2>
      <p>Runs: {runs}</p>
      <span className={
          role === "Batsman"
            ? "role-badge batsman"
            : "role-badge bowler"
        }>{role}</span>
    </div>
  );
}
export default PlayerCard