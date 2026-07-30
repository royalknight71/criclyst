import PlayerCard from "./PlayerCard";

function PlayerGrid({ players }) {
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
        />
      ))}
    </div>
  );
}

export default PlayerGrid;