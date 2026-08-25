/**
 * TeamSkeleton.jsx
 *
 * Loading placeholder that mirrors the TeamCard layout. Renders a
 * pulsing skeleton (logo, name, format badge, captain/coach rows and button)
 * to indicate content is being fetched.
 */

/**
 * Renders a pulse-animated placeholder card matching the team card layout.
 * @returns {JSX.Element} The skeleton card element.
 */
function TeamSkeleton() {
  return (
    <div
      className="
        w-full
        overflow-hidden
        rounded-2xl
        border
        border-slate-700/70
        bg-[#111827]
        p-6
        animate-pulse
      "
    >
      {/* Top Accent */}
      <div className="absolute left-0 right-0 top-0 h-[3px] bg-slate-700" />

      {/* Logo */}
      <div
        className="
          mx-auto mb-5
          flex h-28 w-28
          items-center justify-center
          rounded-full
          border border-slate-600
          bg-[#0b1322]
        "
      >
        <div className="h-20 w-20 rounded-full bg-slate-700" />
      </div>

      {/* Name + Country */}
      <div className="text-center">
        <div className="mx-auto h-6 w-36 rounded bg-slate-700" />
        <div className="mx-auto mt-2 h-4 w-24 rounded bg-slate-700" />
        <div className="mx-auto mt-3 h-6 w-16 rounded-full bg-slate-700" />
      </div>

      {/* Captain / Coach */}
      <div className="mt-6 space-y-3 border-t border-slate-700 pt-5">
        <div className="flex items-center justify-between">
          <div className="h-4 w-16 rounded bg-slate-700" />
          <div className="h-4 w-24 rounded bg-slate-700" />
        </div>
        <div className="flex items-center justify-between">
          <div className="h-4 w-14 rounded bg-slate-700" />
          <div className="h-4 w-20 rounded bg-slate-700" />
        </div>
      </div>

      {/* Button */}
      <div className="mt-6 h-10 w-full rounded-lg bg-slate-700" />
    </div>
  );
}

export default TeamSkeleton;
