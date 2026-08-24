/**
 * SummaryCard.jsx
 *
 * Small presentational dashboard card used on analytics sections to
 * display a single statistic: an icon tile, an uppercase label and a
 * large value. Styled to match the Criclyst dark theme with a subtle
 * hover lift.
 */

/**
 * Renders a single summary stat card (icon, title, value).
 * @param {object} props - Component props.
 * @param {React.ReactNode} props.icon - Icon element rendered inside the icon tile.
 * @param {string} props.title - Label describing the metric.
 * @param {string|number} props.value - The metric value to display.
 * @returns {JSX.Element} The summary card element.
 */
function SummaryCard({ title, value, icon }) {
  return (
    <div
      className="
        h-full rounded-2xl border border-slate-800 bg-[#111827] p-6
        transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400/40
      "
    >
      <div
        className="
          flex h-12 w-12 items-center justify-center rounded-xl
          bg-cyan-500/10 text-cyan-400
        "
      >
        {icon}
      </div>

      <p className="mt-5 text-sm uppercase tracking-wider text-slate-400">
        {title}
      </p>

      <h3 className="mt-1 text-4xl font-black text-white">{value}</h3>
    </div>
  );
}

export default SummaryCard;
