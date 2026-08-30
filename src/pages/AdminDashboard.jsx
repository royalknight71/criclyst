import { Link } from "react-router-dom";

function AdminDashboard() {
    return (
        <section className="relative min-h-screen overflow-hidden bg-[#0B1120]">
            <div className="absolute top-20 left-0 h-96 w-96 rounded-full bg-cyan-500/10 blur-[120px]" />
            <div className="absolute right-0 top-40 h-96 w-96 rounded-full bg-purple-500/10 blur-[120px]" />

            <div className="relative mx-auto max-w-5xl px-6 py-16">
                <div className="mb-14 text-center">
                    <p className="text-cyan-400 font-semibold tracking-[0.3em] uppercase">
                        Admin Panel
                    </p>
                    <h1 className="mt-4 text-5xl font-black leading-tight text-white">
                        Admin <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">Dashboard</span>
                    </h1>
                    <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-400">
                        Manage players, teams, and matches. Only authenticated administrators can access this area.
                    </p>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                    <Link
                        to="/admin/players"
                        className="group rounded-3xl border border-slate-800 bg-[#111827] p-8 transition-all duration-300 hover:border-cyan-400/40 hover:shadow-[0_15px_45px_rgba(34,211,238,.15)]"
                    >
                        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 mb-5">
                            <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Manage Players</h3>
                        <p className="text-slate-400 mb-6">Add, edit, or remove player profiles. Update statistics, roles, and player information.</p>
                        <span className="rounded-xl bg-cyan-400 px-6 py-2.5 font-semibold text-slate-900 transition group-hover:bg-cyan-300 inline-block">
                            Manage Players
                        </span>
                    </Link>

                    <Link
                        to="/admin/teams"
                        className="group rounded-3xl border border-slate-800 bg-[#111827] p-8 transition-all duration-300 hover:border-green-400/40 hover:shadow-[0_15px_45px_rgba(34,197,94,.15)]"
                    >
                        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-green-500/10 text-green-400 mb-5">
                            <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Manage Teams</h3>
                        <p className="text-slate-400 mb-6">Add, edit, or remove teams. Manage captains, squads, rankings, and team details.</p>
                        <span className="rounded-xl bg-green-500 px-6 py-2.5 font-semibold text-white transition group-hover:bg-green-400 inline-block">
                            Manage Teams
                        </span>
                    </Link>

                    <Link
                        to="/admin/matches"
                        className="group rounded-3xl border border-slate-800 bg-[#111827] p-8 transition-all duration-300 hover:border-purple-400/40 hover:shadow-[0_15px_45px_rgba(168,85,247,.15)]"
                    >
                        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400 mb-5">
                            <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Manage Matches</h3>
                        <p className="text-slate-400 mb-6">Create, edit, or remove matches. Set toss details, winners, scores, and match status.</p>
                        <span className="rounded-xl bg-purple-500 px-6 py-2.5 font-semibold text-white transition group-hover:bg-purple-400 inline-block">
                            Manage Matches
                        </span>
                    </Link>
                </div>
            </div>
        </section>
    );
}

export default AdminDashboard;
