/**
 * TeamGrid.jsx
 *
 * Responsive grid layout that renders a collection of TeamCard
 * components for the teams listing page. The column count adapts to
 * viewport width (1 to 4 columns).
 */

import TeamCard from "./TeamCard";

/**
 * Renders a responsive grid of team cards.
 * @param {object} props - Component props.
 * @param {Array<object>} props.teams - List of team objects to render; each must have an `_id` used as the React key.
 * @returns {JSX.Element} The grid of team cards.
 */
function TeamGrid({ teams, onUnfavorite, showFavoriteAction = false }) {
  return (
    <div
      className="
        grid
        grid-cols-1
        sm:grid-cols-2
        lg:grid-cols-3
        xl:grid-cols-4
        gap-6
      "
    >
      {teams.map((team) => (
        <TeamCard
          key={team._id}
          team={team}
          onUnfavorite={onUnfavorite}
          showFavoriteAction={showFavoriteAction}
        />
      ))}
    </div>
  );
}

export default TeamGrid;
