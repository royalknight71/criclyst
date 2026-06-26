

function SummaryCard({title,value,icon}){
    return (
        <div className="individual-summary-card">
            <p>{icon}</p>
            <h2>{title}</h2>
            <h3>{value}</h3>
        </div>
    )
}
export default SummaryCard