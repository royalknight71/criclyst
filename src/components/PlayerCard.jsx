import React from 'react'
import { NavLink} from 'react-router-dom'

function PlayerCard({ name,image, runs, role , wickets, economyRate,BBI}) {
  return (
      <NavLink to={`/player/${name.toLowerCase().replaceAll(" ", "-")}`}>
        <div className="player-card">
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
      </NavLink>
  );
}
export default PlayerCard