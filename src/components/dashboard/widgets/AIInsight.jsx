import {
  FaBrain,
  FaBaseballBatBall,
  FaBullseye,
  FaBolt,
  FaStar,
  FaRobot
} from "react-icons/fa6";

import { MdSportsCricket } from "react-icons/md";

function AIInsight ({player}){
    if (!player) return null;
    const {
    runs,
    average,
    matches,
    strikeRate,
    role,
    name
} = player;
let battingLevel = "";
if(runs>=15000)
    battingLevel="Elite";
else if(runs>=8000)
    battingLevel="Excellent";
else
    battingLevel="Good";


let consistency = "";

if (average >= 80)
    consistency = "Elite";
else if (average >= 60)
    consistency = "Excellent";
else if (average >= 40)
    consistency = "Good";
else
    consistency = "Developing";


let experience = "";

if (matches >= 300)
    experience = "Veteran";
else if (matches >= 150)
    experience = "Experienced";
else if (matches >= 50)
    experience = "Rising";
else
    experience = "Newcomer";

let aggression = "";

if (strikeRate >= 170)
    aggression = "Explosive";
else if (strikeRate >= 120)
    aggression = "Aggressive";
else if (strikeRate >= 70)
    aggression = "Balanced";
else
    aggression = "Defensive";


let overallScore = 0;

if (battingLevel === "Elite") overallScore += 30;
else if (battingLevel === "Excellent") overallScore += 25;
else overallScore += 20;

if (consistency === "Elite") overallScore += 25;
else if (consistency === "Excellent") overallScore += 20;
else if (consistency === "Good") overallScore += 15;
else overallScore += 10;

if (experience === "Veteran") overallScore += 25;
else if (experience === "Experienced") overallScore += 20;
else if (experience === "Rising") overallScore += 15;
else overallScore += 10;

if (aggression === "Explosive") overallScore += 20;
else if (aggression === "Aggressive") overallScore += 15;
else if (aggression === "Balanced") overallScore += 10;
else overallScore += 5;

        const formattedName = name
            .split(" ")
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
let summary=""
if (consistency === "Elite") {
  summary = `${formattedName} is an elite ${role.toLowerCase()} with outstanding consistency and ${experience.toLowerCase()} international experience.`;
}
else if (consistency === "Excellent") {
  summary = `${formattedName} is an accomplished ${role.toLowerCase()} with excellent consistency and ${experience.toLowerCase()} international experience.`;
}
else {
  summary = `${formattedName} is a reliable ${role.toLowerCase()} with ${experience.toLowerCase()} international experience and a balanced playing style.`;
}


return (
  <div className="group bg-slate-900/80 backdrop-blur-md border border-cyan-500/30 rounded-2xl p-6 shadow-xl h-full flex flex-col justify-between
  
transition-all
duration-300
ease-out
hover:-translate-y-2
hover:shadow-2xl
hover:shadow-cyan-500/10
hover:border-cyan-400/40
hover:bg-slate-900
  ">

    {/* Heading */}
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-cyan-500/20 p-3 rounded-xl">
          <FaBrain className="text-cyan-400 text-2xl transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110" />
        </div>

        <div>
          <h2 className="text-xl font-bold text-white">
            Smart Career Insights
          </h2>

          <p className="text-sm text-slate-400">
            Generated from career statistics
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="space-y-4">

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-300">
            <FaBaseballBatBall className="text-cyan-400" />
            <span>Batting</span>
          </div>

          <span className="font-semibold text-green-400">
            {battingLevel}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-300">
            <FaBullseye className="text-cyan-400" />
            <span>Consistency</span>
          </div>

          <span className="font-semibold text-green-400">
            {consistency}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-300">
            <MdSportsCricket className="text-cyan-400" />
            <span>Experience</span>
          </div>

          <span className="font-semibold text-green-400">
            {experience}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-300">
            <FaBolt className="text-cyan-400" />
            <span>Aggression</span>
          </div>

          <span className="font-semibold text-green-400">
            {aggression}
          </span>
        </div>

        <div className="border-t border-slate-700 pt-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-white font-medium">
            <FaStar className="text-yellow-400" />
            <span>Overall Score</span>
          </div>

          <span className="text-2xl font-bold text-cyan-400">
            {overallScore}/100
          </span>
        </div>
        <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
    <div
        className="h-full bg-cyan-400 rounded-full"
        style={{ width: `${overallScore}%` }}
    />
</div>
<p className="text-xs text-slate-400 mt-2">
    Strong Career Profile
</p>

      </div>
    </div>

    {/* Summary */}
    <div className="mt-8">

      <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">

        <h3 className="text-white font-semibold mb-2">
          <FaRobot
              className="text-cyan-400 text-2xl"
          />AI Summary
        </h3>

        <p className="text-slate-300 leading-7 text-sm">
          {summary}
        </p>

      </div>

    </div>

  </div>
);
}

export default AIInsight