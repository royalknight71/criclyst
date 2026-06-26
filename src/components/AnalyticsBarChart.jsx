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

function AnalyticsBarChart({    
    title,
    data,
    dataKey,
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
                <YAxis type="category" dataKey={dataKey} width={140}/>
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