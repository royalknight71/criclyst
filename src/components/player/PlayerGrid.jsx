/**
 * PlayerGrid.jsx
 *
 * Responsive grid layout that renders a collection of PlayerCard
 * components for the players listing page. The column count adapts to
 * viewport width (1 to 4 columns).
 */

import PlayerCard from "./PlayerCard";

/**
 * Renders a responsive grid of player cards.
 * @param {object} props - Component props.
 * @param {Array<object>} props.players - List of player objects to render; each must have an `_id` used as the React key.
 * @returns {JSX.Element} The grid of player cards.
 */
function PlayerGrid({ players, onUnfavorite, showFavoriteAction = false }) {
  return (   
    <div
  className="
    grid
    grid-cols-1
    sm:grid-cols-2
    lg:grid-cols-3
    xl:grid-cols-4
    gap-8
    justify-items-center
  "
>
      {players.map((player) => (
        <PlayerCard
          key={player._id}
          player={player}
          onUnfavorite={onUnfavorite}
          showFavoriteAction={showFavoriteAction}
        />
      ))}
    </div>
  );
}

export default PlayerGrid;