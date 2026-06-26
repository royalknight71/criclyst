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
import AnalyticsBarChart from "../components/AnalyticsBarChart";
import RolePieChart from "../components/RolePieChart";

import {
    getTopRuns,
    getTopWickets,
    getRoleDistribution
} from "../utils/analytics";

function Analytics(){
    const topruns=getTopRuns(players)
    const topwickets=getTopWickets(players)
    const data = getRoleDistribution(players)
    const COLORS = ['#0088FE', '#ae3333', '#29ce60', '#FF8042'];
    return (
        <>
        <div className="analytics-page">
        <h1>Analytics Dashboard</h1>
        <br />
        <h3>Visual insights into Team India ODI squad</h3>

        <div className="graph-container">
            <AnalyticsBarChart
                title="Top Run Scorers"
                data={topruns}
                dataKey="runs"
                color="#6C63FF"
                name="Runs"
            />
        <AnalyticsBarChart
                title="Top 5 Wicket Takers"
                data={topwickets}
                dataKey="wickets"
                color="#de2929"
                name="Wickets"
            />
        <RolePieChart
        title="Squad Composition"
        data={data}
        dataKey="count"
        nameKey="role"
        COLORS={COLORS}
        />
        </div>
        </div>
        </>
    )
}

export default Analytics