function PlayerSkeleton() {
  return (
    <article
      className="
        w-full
        max-w-[380px]
        overflow-hidden
        rounded-3xl
        border
        border-slate-800
        bg-[#111827]
        animate-pulse
      "
    >
      {/* Top Accent */}
      <div className="h-1 bg-slate-700" />

      <div className="p-6">

        {/* Image + Name */}
        <div className="flex items-center gap-4">

          <div className="h-16 w-16 rounded-full bg-slate-700" />

          <div className="flex-1">

            <div className="h-5 w-36 rounded bg-slate-700" />

            <div className="mt-3 h-4 w-24 rounded bg-slate-700" />

            <div className="mt-4 h-6 w-28 rounded-full bg-slate-700" />

          </div>

        </div>

        {/* Stats */}

        <div className="mt-6 space-y-3">

          {[1, 2, 3, 4].map((item) => (

            <div
              key={item}
              className="
                flex
                items-center
                justify-between
                rounded-xl
                border
                border-slate-800
                bg-slate-900/40
                px-4
                py-3
              "
            >

              <div className="flex items-center gap-3">

                <div className="h-10 w-10 rounded-xl bg-slate-700" />

                <div>

                  <div className="h-3 w-20 rounded bg-slate-700" />

                  <div className="mt-2 h-5 w-14 rounded bg-slate-700" />

                </div>

              </div>

            </div>

          ))}

        </div>

        {/* Footer */}

        <div className="mt-6 border-t border-slate-800 pt-4">

          <div className="flex justify-between">

            <div>

              <div className="h-3 w-10 rounded bg-slate-700" />

              <div className="mt-2 h-4 w-24 rounded bg-slate-700" />

            </div>

            <div>

              <div className="h-3 w-12 rounded bg-slate-700" />

              <div className="mt-2 h-4 w-10 rounded bg-slate-700" />

            </div>

          </div>

          <div className="mt-5 h-4 w-28 ml-auto rounded bg-slate-700" />

        </div>

      </div>
    </article>
  );
}

export default PlayerSkeleton;