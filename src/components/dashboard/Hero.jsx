/**
 * Hero.jsx
 *
 * Landing hero section for the dashboard. Displays the main headline, an
 * AI-powered badge, a typewriter-animated tagline cycling through multiple
 * texts, feature highlights, and navigation buttons to the players and
 * analytics pages.
 */

import { NavLink } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import {
  FaRobot,
  FaChartLine,
  FaUsers,
  FaBrain,
} from "react-icons/fa";
import { useState, useEffect } from "react";

/**
 * Hero component.
 *
 * Runs a type/delete typewriter effect over the taglines using timed state
 * updates: characters are typed at 70ms intervals and deleted at 40ms, with
 * a pause after each full sentence.
 *
 * @component
 * @returns {JSX.Element} The hero landing section.
 */
function Hero() {
  //Text Animation Typre-Writer
const texts = [
  "Analyze players with AI-powered insights.",
  "Compare player performance instantly.",
  "Visualize cricket analytics like never before."
];

const [textIndex, setTextIndex] = useState(0);
const [displayText, setDisplayText] = useState("");
const [isDeleting, setIsDeleting] = useState(false);

useEffect(() => {
  const currentText = texts[textIndex];

  const timeout = setTimeout(() => {

    if (!isDeleting) {

      setDisplayText(
        currentText.substring(0, displayText.length + 1)
      );

      if (displayText === currentText) {
        setTimeout(() => {
          setIsDeleting(true);
        }, 1500);
      }

    } else {

      setDisplayText(
        currentText.substring(0, displayText.length - 1)
      );

      if (displayText === "") {
        setIsDeleting(false);
        setTextIndex((prev) => (prev + 1) % texts.length);
      }

    }

  }, isDeleting ? 40 : 70);

  return () => clearTimeout(timeout);

}, [displayText, isDeleting, textIndex]);
  return (
    <>
    <section
  className="
flex
min-h-[85vh]
items-center
justify-center
px-6
pt-10
bg-gradient-to-b
from-[#020617]
via-[#0f172a]
to-[#111827]
py-24
"
>
  <div className="max-w-4xl text-center">

    {/* AI Badge */}
    <div className="mb-6 flex items-center justify-center gap-3">
      <FaRobot
    className="text-cyan-400 text-4xl animate-bounce"
/>
      <span className="uppercase tracking-[0.3em] text-cyan-400 font-semibold">
        AI Powered
      </span>
    </div>

    {/* Main Heading */}
        <h1 className="text-6xl font-extrabold leading-tight text-white">
            Cricket Analytics
        </h1>

        <h2 className="text-7xl font-extrabold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent leading-tight pb-2">
    Beyond Statistics
</h2>
    {/* Typewriter */}
    <p className="mx-auto mt-8 max-w-2xl text-xl leading-9 text-slate-300">
      {displayText}
      <span className="animate-pulse">|</span>
    </p>

    {/* Extra Text */}
<div className="mt-10 flex flex-wrap justify-center items-center gap-8 text-slate-300">

    <div className="flex items-center gap-2">
        <FaUsers className="text-cyan-400 text-xl"/>
        <span>Compare Players</span>
    </div>

    <span className="text-slate-600">•</span>

    <div className="flex items-center gap-2">
        <FaChartLine className="text-cyan-400 text-xl"/>
        <span>Interactive Analytics</span>
    </div>

    <span className="text-slate-600">•</span>

    <div className="flex items-center gap-2">
        <FaBrain className="text-cyan-400 text-xl"/>
        <span>AI Match Insights</span>
    </div>

</div>

    {/* Buttons */}
    <div className="mt-12 flex justify-center gap-6">

      <NavLink
            to="/players"
            className="group flex items-center gap-3 rounded-xl border border-cyan-500 px-8 py-4 font-semibold text-cyan-400 transition-all duration-300 hover:-translate-y-1 hover:bg-cyan-500 hover:text-slate-900 hover:shadow-[0_0_30px_rgba(34,211,238,0.35)]"
            >
            Explore Players
            <FaArrowRight className="transition-transform duration-300 group-hover:translate-x-2" />
            </NavLink>

            <NavLink
            to="/analytics"
            className="rounded-xl border border-cyan-500 px-8 py-4 font-semibold text-cyan-400 transition-all duration-300 hover:-translate-y-1 hover:bg-cyan-500 hover:text-slate-900 hover:shadow-[0_0_30px_rgba(34,211,238,0.35)]"
            >
            View Analytics
            </NavLink>

    </div>

  </div>
</section>
    </>
   
  );
}

export default Hero;