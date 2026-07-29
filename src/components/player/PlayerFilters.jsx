function PlayerFilters({ value, onChange }) {
  return (
    <div className="player-filters">

      <label htmlFor="role">
        Choose Role
      </label>

      <select
        id="role"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="All">All Roles</option>
        <option value="Batsman">Batsman</option>
        <option value="Bowler">Bowler</option>
        <option value="All-Rounder">All Rounder</option>
        <option value="Wicket-Keeper">Wicket Keeper</option>
      </select>

    </div>
  );
}

export default PlayerFilters;