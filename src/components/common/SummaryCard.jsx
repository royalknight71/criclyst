/**
 * SummaryCard.jsx
 *
 * Small presentational card used on dashboard/summary sections to
 * display a single statistic, consisting of an icon, a title label
 * and its corresponding value.
 */

/**
 * Renders a single summary stat card (icon, title, value).
 * @param {object} props - Component props.
 * @param {React.ReactNode} props.icon - Icon element displayed above the title.
 * @param {string} props.title - Label describing the metric.
 * @param {string|number} props.value - The metric value to display.
 * @returns {JSX.Element} The summary card element.
 */
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