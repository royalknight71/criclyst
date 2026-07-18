import { ResponsiveContainer, PieChart, Pie, Tooltip,Legend, Cell } from "recharts"

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