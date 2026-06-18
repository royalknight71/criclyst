function PlayerCard(props){
    return(
        <div className="player-card">
        <h2>{props.name}</h2> 
        <p>Runs: {props.runs}</p>
        <p>Role: {props.role}</p>
        </div>

    )
}
export default PlayerCard