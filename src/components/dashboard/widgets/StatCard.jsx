/**
 * StatCard.jsx
 *
 * Reusable dashboard statistic tile. Displays an icon, a title, a large
 * formatted numeric value, and an optional subtitle in a hoverable card.
 */


/**
 * StatCard component.
 *
 * @component
 * @param {Object} props - Component props.
 * @param {string} props.title - Statistic title shown next to the icon.
 * @param {number|string} props.value - The statistic value (rendered with
 *   locale-aware number formatting when numeric).
 * @param {string} [props.subtitle] - Optional descriptive text below the value.
 * @param {React.ReactNode} props.icon - Icon element displayed beside the title.
 * @returns {JSX.Element} The rendered statistic card.
 */
function StatCard({title,value,subtitle,icon}){
    return (
<div
className="
group
rounded-3xl
bg-slate-900
border
border-slate-700
p-7
transition-all
duration-300
hover:-translate-y-2
hover:border-cyan-400/40
hover:shadow-[0_0_40px_rgba(6,182,212,0.12)]
"
>
           <div className="flex items-center gap-3 hover:bg-slate-800/80">

<div className="
w-14
h-14
rounded-2xl
bg-cyan-500/10
flex
items-center
justify-center
text-cyan-400
text-2xl
transition-transform
duration-300
group-hover:scale-110
">
    {icon}
</div>

  <h3 className="text-xl font-semibold text-white">
    {title}
</h3>

</div>
<h2 className="mt-8 text-5xl font-bold text-white">
    {value?.toLocaleString()}
</h2>
<p className="mt-3 text-slate-400">
    {subtitle}
</p>
        </div>
    )
}

export default StatCard