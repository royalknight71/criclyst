/**
 * AnalyticsBarChart.jsx
 *
 * Reusable horizontal bar chart card built with Recharts. Renders a
 * titled chart card containing a vertical-layout bar chart with grid,
 * tooltip, legend and animated bars for visualizing a single metric
 * across categories.
 */

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

/**
 * Renders an animated horizontal bar chart inside a titled chart card.
 * @param {object} props - Component props.
 * @param {string} props.title - Chart title displayed above the chart.
 * @param {Array<object>} props.data - Array of data objects to plot.
 * @param {string} props.dataKey - Key in each data object holding the numeric value to plot.
 * @param {string} props.namekey - Key in each data object holding the category label (Y axis).
 * @param {string} props.color - Fill color for the bars.
 * @param {string} props.name - Legend/series name for the bar.
 * @returns {JSX.Element} The bar chart card element.
 */
function AnalyticsBarChart({    
    title,
    data,
    dataKey,
    namekey,
    color,
    name})
    {
    return (
                <div className="chart-card">
            <h2 className="chart-title">{title}</h2>
            <ResponsiveContainer width="95%" height={300}>
                <BarChart
              data={data}
              layout="vertical"
              margin={{
                top: 5,
                right: 0,
                left: 0,
                bottom: 0,
              }}
            >
              <CartesianGrid 
                  stroke="#444"
            strokeDasharray="4 4"
              />
                <XAxis type="number" />
                <YAxis type="category" dataKey={namekey} width={140}/>
                <Tooltip cursor={{ fill: "rgba(108,99,255,0.15)" }}/>
        
                <Legend verticalAlign="top"/>
        
                <Bar
                    dataKey={dataKey}
                    name={name}
                    fill={color}
                    isAnimationActive
                    animationDuration={1200}
                    />
            </BarChart>
            <div>
              <br />
            </div>
            </ResponsiveContainer>
              </div>
    )
}
export default AnalyticsBarChart