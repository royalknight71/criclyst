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
import SummaryCard from "../components/SummaryCard";

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
        <div className="summary-card">
            <SummaryCard
            icon="👥"
                title="Players"
                value={players.length}
            />
            <SummaryCard
            icon="🏏"
            title="Batsman"
            value={data[0].count}
            />
            <SummaryCard
            icon="🎯"
            title="Bowler"
            value={data[1].count}
            />
            <SummaryCard
            icon="⭐"
            title="All Rounder"
            value={data[2].count}
            />
            <SummaryCard
            icon="🥅"
            title="Wicket Keeper"
            value={data[3].count}
            />
        </div>
        <div className="graph-container">
            <AnalyticsBarChart
                title="Top Run Scorers"
                data={topruns}
                dataKey="runs"
                namekey="name"
                color="#6C63FF"
                name="Runs"
            />
        <AnalyticsBarChart
                title="Top 5 Wicket Takers"
                data={topwickets}
                dataKey="wickets"
                namekey="name"
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