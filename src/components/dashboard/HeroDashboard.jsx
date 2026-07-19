

function HeroDashboard() {
  return (
    <section className="-mt-20 relative z-20 px-6">
      <div className="mx-auto max-w-6xl rounded-3xl border border-slate-800 bg-slate-900/90 p-8 shadow-2xl backdrop-blur-md">

        <header className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-cyan-400">
              Live Analytics
            </p>

            <h2 className="mt-2 text-3xl font-bold text-white">
              Cricket Performance Dashboard
            </h2>
          </div>

          <span className="rounded-full bg-green-500/15 px-4 py-2 text-sm font-medium text-green-400">
            ● Live
          </span>
        </header>

        <main className="h-72 rounded-2xl border border-dashed border-slate-700 flex items-center justify-center text-slate-500">
          Dashboard Content Coming Next...
        </main>

      </div>
    </section>
  );
}

export default HeroDashboard;