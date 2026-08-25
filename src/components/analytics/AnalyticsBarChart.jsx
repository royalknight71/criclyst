/**
 * AnalyticsBarChart.jsx
 *
 * Reusable horizontal bar chart card built with Recharts. Renders a
 * titled dark-theme card containing a vertical-layout bar chart with
 * subtle grid, themed tooltip, legend and animated bars for
 * visualizing a single metric across categories.
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

/** Shared axis tick styling for readability on the dark background. */
const AXIS_TICK = { fill: "#94a3b8", fontSize: 12 };

/** Shared tooltip styling matching the Criclyst card theme. */
const TOOLTIP_STYLE = {
  contentStyle: {
    backgroundColor: "#111827",
    border: "1px solid #334155",
    borderRadius: "12px",
  },
  itemStyle: { color: "#e2e8f0" },
  labelStyle: { color: "#94a3b8" },
};

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
        <div
            className="
                rounded-3xl border border-slate-800 bg-[#111827] p-6
                transition-colors duration-300 hover:border-slate-700 sm:p-8
            "
        >
            <h2 className="mb-6 text-lg font-bold text-white sm:text-xl">
                {title}
            </h2>

            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={data}
                        layout="vertical"
                        margin={{
                            top: 5,
                            right: 16,
                            left: 0,
                            bottom: 0,
                        }}
                    >
                        <CartesianGrid
                            stroke="#1e293b"
                            strokeDasharray="4 4"
                            horizontal={false}
                        />

                        <XAxis
                            type="number"
                            tick={AXIS_TICK}
                            stroke="#334155"
                        />

                        <YAxis
                            type="category"
                            dataKey={namekey}
                            width={140}
                            tick={AXIS_TICK}
                            stroke="#334155"
                        />

                        <Tooltip
                            {...TOOLTIP_STYLE}
                            cursor={{ fill: "rgba(148,163,184,0.08)" }}
                        />

                        <Legend
                            verticalAlign="top"
                            iconType="circle"
                            formatter={(value) => (
                                <span className="text-slate-400">{value}</span>
                            )}
                        />

                        <Bar
                            dataKey={dataKey}
                            name={name}
                            fill={color}
                            radius={[0, 8, 8, 0]}
                            isAnimationActive
                            animationDuration={1200}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}
export default AnalyticsBarChart
