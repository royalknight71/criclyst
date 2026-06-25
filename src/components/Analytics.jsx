import players from "../data/players"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Pie, PieChart, Cell,
} from "recharts";

function Analytics(){
    const topruns=[...players]
    .sort((a, b) => b.runs - a.runs)
    .slice(0,5)

    const topwickets=[...players]
    .sort((a, b) => b.wickets - a.wickets)
    .slice(0,5)

    const data=[]
    let cntBat=0
    let cntBowl=0
    let allRound=0
    let wktKeep=0
    for (const player of players) {
        if(player.role==="Batsman")
            cntBat++
        else if(player.role==="Bowler")
            cntBowl++
        else if(player.role==="All-Rounder")
            allRound++
        else if(player.role==="Wicket Keeper")
            wktKeep++
    }
    data.push({
        role:"Batsman",
        count:cntBat
    })
    data.push({
        role:"Bowler",
        count:cntBowl
    })
    data.push({
        role:"All-Rounder",
        count:allRound
    })
    data.push({
        role:"Wicket Keeper",
        count:wktKeep
    })

    const COLORS = ['#0088FE', '#ae3333', '#29ce60', '#FF8042'];

    return (
        <>
        <div className="analytics-page">
        <h1>Analytics Dashboard</h1>
        <br />
        <h3>Visual insights into Team India ODI squad</h3>

        <div className="graph-container">
        <div className="chart-card">
                    <h2 className="chart-title">Top 5 Run Scorers</h2>
    <ResponsiveContainer width="95%" height={300}>
        <BarChart
      data={topruns}
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
        <YAxis type="category" dataKey="name" width={140}/>
        <Tooltip cursor={{ fill: "rgba(108,99,255,0.15)" }}/>

        <Legend verticalAlign="top"/>

        <Bar
            dataKey="runs"
            name="Runs"
            fill="#6C63FF"
            isAnimationActive
            animationDuration={1200}
            />
    </BarChart>
    <div>
      <br />
    </div>
    </ResponsiveContainer>
      </div>

      <div className="chart-card">
                    <h2 className="chart-title">
                Top 5 Wicket Takers
            </h2>
        <ResponsiveContainer width="95%" height={300}>
        <BarChart
      data={topwickets}
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
        <YAxis type="category" dataKey="name" width={140}/>
        <Tooltip cursor={{ fill: "rgba(108,99,255,0.15)" }}/>

        <Legend verticalAlign="top"/>

        <Bar
            dataKey="wickets"
            name="Wickets"
            fill="#de2929"
            isAnimationActive
            animationDuration={1200}
            />
    </BarChart>
    </ResponsiveContainer>
                </div>

            <div className="chart-card">

            <h2 className="chart-title">
                Squad Composition
            </h2>
            <ResponsiveContainer width="100%" height={320}>
            <PieChart>
                <Pie
                data={data}
                dataKey="count"
                nameKey="role"
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
        </div>
        </div>
        </>
    )
}

export default Analytics