/**
 * PlayerCard.jsx
 *
 * Compact player card that links to the player's detail page. Displays
 * the player's name, photo and role badge, with a headline stat that
 * varies by role: runs for batsmen/wicket-keepers, wickets for bowlers,
 * and both for all-rounders.
 */

import { NavLink} from 'react-router-dom'

/**
 * Renders a clickable player summary card linking to the player's detail page.
 * @param {object} props - Component props.
 * @param {string} props.name - Player's name (also used to build the profile URL).
 * @param {string} props.image - URL of the player's photo.
 * @param {string} props.role - Player role ("Batsman", "Wicket Keeper", "Bowler", or all-rounder).
 * @param {number|string} props.runs - Total runs scored.
 * @param {number|string} props.wickets - Total wickets taken.
 * @returns {JSX.Element} The player card link element.
 */
function PlayerCard({ name,image, runs, role , wickets}) {
  return (
      <NavLink
        to={`/player/${name.toLowerCase().replaceAll(" ", "-")}`}
        className="player-card-link"
      >
        <div className="player-card">

      <h2>{name}</h2>
      <img src={image} alt={name} className="player-image" />
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
      </NavLink>
  );
}
export default PlayerCard