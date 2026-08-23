/**
 * RolePieChart.jsx
 *
 * Reusable pie chart card built with Recharts, used to visualize the
 * distribution of players by role. Renders a titled chart with labeled
 * slices (name and percentage), a tooltip showing player counts and a
 * bottom legend.
 */

import { ResponsiveContainer, PieChart, Pie, Tooltip,Legend, Cell } from "recharts"

/**
 * Renders a pie chart of role distribution inside a titled chart card.
 * @param {object} props - Component props.
 * @param {string} props.title - Chart title displayed above the chart.
 * @param {Array<object>} props.data - Array of data objects to plot.
 * @param {string} props.dataKey - Key in each data object holding the numeric value per slice.
 * @param {string} props.nameKey - Key in each data object holding the slice label.
 * @param {Array<string>} props.COLORS - List of hex colors cycled across pie slices.
 * @returns {JSX.Element} The pie chart card element.
 */
function RolePieChart({
    title,
    data,
    dataKey,
    nameKey,
    COLORS
}){
    return (
        <div className="chart-card">

            <h2 className="chart-title">
                {title}
            </h2>
            <ResponsiveContainer width="100%" height={320}>
            <PieChart>
                <Pie
                data={data}
                dataKey={dataKey}
                nameKey={nameKey}
                cx="50%"
                cy="50%"
                outerRadius={110}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
                </Pie>

                <Tooltip formatter={(value, name) => [`${value} Players`, name]} />
                
                <Legend verticalAlign="bottom" iconType="circle" />
            </PieChart>
            </ResponsiveContainer>
        </div>
    )
}
export default RolePieChart