/**
 * RolePieChart.jsx
 *
 * Reusable pie chart card built with Recharts, used to visualize the
 * distribution of players by role. Renders a titled dark-theme chart
 * card with labeled slices (name and percentage), a themed tooltip
 * showing player counts and a bottom legend.
 */

import { ResponsiveContainer, PieChart, Pie, Tooltip, Legend, Cell } from "recharts"
import { useEffect, useState } from "react";

/** Shared tooltip styling matching the Criclyst card theme. */
const TOOLTIP_STYLE = {
    contentStyle: {
        backgroundColor: "#111827",
        border: "1px solid #334155",
        borderRadius: "12px",
        maxWidth: "calc(100vw - 32px)",
        overflowWrap: "anywhere",
    },
    itemStyle: { color: "#e2e8f0" },
};

/**
 * Renders a pie chart of role distribution inside a titled chart card.
 * @param {object} props - Component props.
 * @param {string} props.title - Chart title displayed above the chart.
 * @param {Array<object>} props.data - Array of data objects to plot.
 * @param {string} props.dataKey - Key in each data object holding the numeric value per slice.
 * @param {string} props.nameKey - Key in each data object holding the slice label.
 * @param {Array<string>} props.COLORS - List of hex colors cycled across pie slices.
 * @param {number} [props.innerRadius] - Optional inner radius; when set the
 *   pie renders as a donut chart. Defaults to a solid pie.
 * @returns {JSX.Element} The pie chart card element.
 */
function RolePieChart({
    title,
    data,
    dataKey,
    nameKey,
    COLORS,
    innerRadius
}){
    const [isNarrow, setIsNarrow] = useState(() => window.innerWidth < 640);

    useEffect(() => {
        const handleResize = () => setIsNarrow(window.innerWidth < 640);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <div
            className="
                min-w-0 rounded-3xl border border-slate-800 bg-[#111827] p-4
                transition-colors duration-300 hover:border-slate-700 sm:p-8
            "
        >
            <h2 className="mb-5 break-words text-lg font-bold text-white sm:mb-6 sm:text-xl">
                {title}
            </h2>

            <div className="h-[320px] w-full min-w-0 sm:h-[340px]">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            dataKey={dataKey}
                            nameKey={nameKey}
                            cx="50%"
                            cy="45%"
                            outerRadius={isNarrow ? 74 : 95}
                            innerRadius={isNarrow ? 44 : innerRadius}
                            labelLine={{ stroke: "#475569" }}
                            label={({ cx, cy, midAngle, outerRadius, name, percent }) => {
                                const RADIAN = Math.PI / 180;
                                const radius = isNarrow ? outerRadius * 0.68 : outerRadius + 24;
                                const x = cx + radius * Math.cos(-midAngle * RADIAN);
                                const y = cy + radius * Math.sin(-midAngle * RADIAN);
                                return (
                                    <text
                                        x={x}
                                        y={y}
                                        fill="#cbd5e1"
                                        fontSize={isNarrow ? 10 : 12}
                                        textAnchor={isNarrow ? "middle" : x > cx ? "start" : "end"}
                                        dominantBaseline="central"
                                    >
                                        {isNarrow ? `${(percent * 100).toFixed(0)}%` : `${name} ${(percent * 100).toFixed(0)}%`}
                                    </text>
                                );
                            }}
                        >
                            {data.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={COLORS[index % COLORS.length]}
                                    stroke="#111827"
                                />
                            ))}
                        </Pie>

                        <Tooltip
                            {...TOOLTIP_STYLE}
                            allowEscapeViewBox={{ x: false, y: false }}
                            formatter={(value, name) => [`${value} Players`, name]}
                        />

                        <Legend
                            verticalAlign="bottom"
                            iconType="circle"
                            wrapperStyle={{ width: "100%", left: 0, bottom: 0 }}
                            formatter={(value) => (
                                <span className="break-words text-slate-400">{value}</span>
                            )}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}
export default RolePieChart
