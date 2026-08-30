import { useState, useEffect } from "react";
import { getMatches, createMatch, updateMatch, deleteMatch } from "../services/match.service";
import { getTeams } from "../services/team.service";
import { getPlayers } from "../services/player.service";

function AdminMatches() {
    const [matches, setMatches] = useState([]);
    const [allTeams, setAllTeams] = useState([]);
    const [allPlayers, setAllPlayers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalMatches, setTotalMatches] = useState(0);
    const [editingMatch, setEditingMatch] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({
        teamA: "", teamB: "", venue: "", matchDate: "", format: "odi",
        status: "upcoming", tossWinner: "", tossDecision: "",
        winner: "", result: "", manOfTheMatch: ""
    });
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchMatches();
    }, [page]);

    useEffect(() => {
        getTeams(1, 50).then((d) => setAllTeams(d.data || [])).catch(() => {});
        getPlayers(1, 100).then((d) => setAllPlayers(d.data || [])).catch(() => {});
    }, []);

    async function fetchMatches() {
        setLoading(true);
        try {
            const data = await getMatches({ page, limit: 10 });
            setMatches(data.data);
            setTotalPages(data.totalPages);
            setTotalMatches(data.totalMatches);
        } catch (e) {
            setError(e.response?.data?.message || "Failed to load matches");
        } finally {
            setLoading(false);
        }
    }

    function openCreate() {
        setEditingMatch(null);
        setForm({
            teamA: "", teamB: "", venue: "", matchDate: "", format: "odi",
            status: "upcoming", tossWinner: "", tossDecision: "",
            winner: "", result: "", manOfTheMatch: ""
        });
        setShowForm(true);
        setError(null);
    }

    function openEdit(m) {
        setEditingMatch(m);
        const fmtDate = m.matchDate ? new Date(m.matchDate).toISOString().slice(0, 16) : "";
        setForm({
            teamA: m.teamA?._id || "", teamB: m.teamB?._id || "", venue: m.venue || "",
            matchDate: fmtDate, format: m.format || "odi", status: m.status || "upcoming",
            tossWinner: m.tossWinner?._id || "", tossDecision: m.tossDecision || "",
            winner: m.winner?._id || "", result: m.result || "",
            manOfTheMatch: m.manOfTheMatch?._id || ""
        });
        setShowForm(true);
        setError(null);
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setError(null);
        const payload = { ...form };
        if (!payload.tossWinner) payload.tossWinner = null;
        if (!payload.tossDecision) payload.tossDecision = null;
        if (!payload.winner) payload.winner = null;
        if (!payload.manOfTheMatch) payload.manOfTheMatch = null;
        try {
            if (editingMatch) {
                await updateMatch(editingMatch._id, payload);
            } else {
                await createMatch(payload);
            }
            setShowForm(false);
            fetchMatches();
        } catch (err) {
            setError(err.response?.data?.message || "Operation failed");
        }
    }

    async function handleDelete(id) {
        if (!window.confirm("Delete this match?")) return;
        try {
            await deleteMatch(id);
            fetchMatches();
        } catch (err) {
            alert(err.response?.data?.message || "Delete failed");
        }
    }

    const inputCls = "rounded-lg border border-slate-700 bg-slate-900 px-4 py-2.5 text-white placeholder-slate-500 outline-none focus:border-purple-400";

    const teamOptions = allTeams.map((t) => (
        <option key={t._id} value={t._id}>{t.name} ({t.format?.toUpperCase()})</option>
    ));

    const statusColors = {
        live: "text-red-400", upcoming: "text-cyan-400", completed: "text-green-400"
    };

    return (
        <section className="relative min-h-screen overflow-hidden bg-[#0B1120]">
            <div className="absolute top-20 left-0 h-96 w-96 rounded-full bg-purple-500/10 blur-[120px]" />
            <div className="relative mx-auto max-w-6xl px-6 py-16">
                <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="text-purple-400 font-semibold tracking-[0.2em] uppercase text-sm">Admin</p>
                        <h1 className="mt-2 text-4xl font-black text-white">Manage Matches</h1>
                        <p className="mt-2 text-slate-400">{totalMatches} total matches</p>
                    </div>
                    <button onClick={openCreate} className="rounded-xl bg-purple-500 px-6 py-3 font-semibold text-white transition hover:bg-purple-400">
                        + Add Match
                    </button>
                </div>

                {showForm && (
                    <div className="mb-8 rounded-2xl border border-slate-700 bg-[#111827] p-6">
                        <h2 className="mb-4 text-xl font-bold text-white">{editingMatch ? "Edit Match" : "Add Match"}</h2>
                        {error && <p className="mb-4 text-sm text-red-400">{error}</p>}
                        <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            <div>
                                <label className="mb-1 block text-xs uppercase tracking-wider text-slate-400">Team A</label>
                                <select required value={form.teamA} onChange={(e) => setForm({ ...form, teamA: e.target.value })} className={inputCls + " w-full"}>
                                    <option value="">-- Select --</option>
                                    {teamOptions}
                                </select>
                            </div>
                            <div>
                                <label className="mb-1 block text-xs uppercase tracking-wider text-slate-400">Team B</label>
                                <select required value={form.teamB} onChange={(e) => setForm({ ...form, teamB: e.target.value })} className={inputCls + " w-full"}>
                                    <option value="">-- Select --</option>
                                    {teamOptions}
                                </select>
                            </div>
                            <input required placeholder="Venue" value={form.venue} onChange={(e) => setForm({ ...form, venue: e.target.value })} className={inputCls} />
                            <div>
                                <label className="mb-1 block text-xs uppercase tracking-wider text-slate-400">Match Date</label>
                                <input required type="datetime-local" value={form.matchDate} onChange={(e) => setForm({ ...form, matchDate: e.target.value })} className={inputCls + " w-full"} />
                            </div>
                            <div>
                                <label className="mb-1 block text-xs uppercase tracking-wider text-slate-400">Format</label>
                                <select value={form.format} onChange={(e) => setForm({ ...form, format: e.target.value })} className={inputCls + " w-full"}>
                                    <option value="odi">ODI</option>
                                    <option value="t20i">T20I</option>
                                    <option value="test">Test</option>
                                </select>
                            </div>
                            <div>
                                <label className="mb-1 block text-xs uppercase tracking-wider text-slate-400">Status</label>
                                <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className={inputCls + " w-full"}>
                                    <option value="upcoming">Upcoming</option>
                                    <option value="live">Live</option>
                                    <option value="completed">Completed</option>
                                </select>
                            </div>

                            {form.status !== "upcoming" && (
                                <>
                                    <div>
                                        <label className="mb-1 block text-xs uppercase tracking-wider text-slate-400">Toss Winner</label>
                                        <select value={form.tossWinner} onChange={(e) => setForm({ ...form, tossWinner: e.target.value })} className={inputCls + " w-full"}>
                                            <option value="">-- None --</option>
                                            {form.teamA && <option value={form.teamA}>{allTeams.find((t) => t._id === form.teamA)?.name || "Team A"}</option>}
                                            {form.teamB && <option value={form.teamB}>{allTeams.find((t) => t._id === form.teamB)?.name || "Team B"}</option>}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="mb-1 block text-xs uppercase tracking-wider text-slate-400">Toss Decision</label>
                                        <select value={form.tossDecision} onChange={(e) => setForm({ ...form, tossDecision: e.target.value })} className={inputCls + " w-full"}>
                                            <option value="">-- None --</option>
                                            <option value="bat">Bat</option>
                                            <option value="bowl">Bowl</option>
                                        </select>
                                    </div>
                                </>
                            )}

                            {form.status === "completed" && (
                                <>
                                    <div>
                                        <label className="mb-1 block text-xs uppercase tracking-wider text-slate-400">Winner</label>
                                        <select required value={form.winner} onChange={(e) => setForm({ ...form, winner: e.target.value })} className={inputCls + " w-full"}>
                                            <option value="">-- Select --</option>
                                            {form.teamA && <option value={form.teamA}>{allTeams.find((t) => t._id === form.teamA)?.name || "Team A"}</option>}
                                            {form.teamB && <option value={form.teamB}>{allTeams.find((t) => t._id === form.teamB)?.name || "Team B"}</option>}
                                        </select>
                                    </div>
                                    <div className="sm:col-span-2">
                                        <label className="mb-1 block text-xs uppercase tracking-wider text-slate-400">Result</label>
                                        <input required placeholder="e.g. India won by 5 wickets" value={form.result} onChange={(e) => setForm({ ...form, result: e.target.value })} className={inputCls + " w-full"} />
                                    </div>
                                    <div className="sm:col-span-2 lg:col-span-3">
                                        <label className="mb-1 block text-xs uppercase tracking-wider text-slate-400">Man of the Match</label>
                                        <select value={form.manOfTheMatch} onChange={(e) => setForm({ ...form, manOfTheMatch: e.target.value })} className={inputCls + " w-full"}>
                                            <option value="">-- None --</option>
                                            {allPlayers
                                                .filter((p) => {
                                                    const teamAObj = allTeams.find((t) => t._id === form.teamA);
                                                    const teamBObj = allTeams.find((t) => t._id === form.teamB);
                                                    const squadA = (teamAObj?.players || []).map((pl) => typeof pl === "object" ? pl._id : pl);
                                                    const squadB = (teamBObj?.players || []).map((pl) => typeof pl === "object" ? pl._id : pl);
                                                    return squadA.includes(p._id) || squadB.includes(p._id);
                                                })
                                                .map((p) => (
                                                    <option key={p._id} value={p._id}>{p.name} ({p.country})</option>
                                                ))
                                            }
                                        </select>
                                    </div>
                                </>
                            )}

                            <div className="flex gap-3 sm:col-span-2 lg:col-span-3">
                                <button type="submit" className="rounded-lg bg-purple-500 px-6 py-2.5 font-semibold text-white hover:bg-purple-400">
                                    {editingMatch ? "Update" : "Create"}
                                </button>
                                <button type="button" onClick={() => setShowForm(false)} className="rounded-lg border border-slate-700 px-6 py-2.5 font-semibold text-slate-300 hover:border-slate-500">
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {loading ? (
                    <div className="flex justify-center py-20"><div className="h-10 w-10 animate-spin rounded-full border-4 border-purple-400 border-t-transparent" /></div>
                ) : (
                    <>
                        <div className="overflow-x-auto rounded-2xl border border-slate-800">
                            <table className="w-full text-left text-sm">
                                <thead className="border-b border-slate-800 bg-slate-900/50">
                                    <tr>
                                        <th className="px-5 py-3 font-semibold text-slate-300">Teams</th>
                                        <th className="px-5 py-3 font-semibold text-slate-300">Format</th>
                                        <th className="px-5 py-3 font-semibold text-slate-300">Status</th>
                                        <th className="px-5 py-3 font-semibold text-slate-300">Date</th>
                                        <th className="px-5 py-3 font-semibold text-slate-300">Venue</th>
                                        <th className="px-5 py-3 font-semibold text-slate-300">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {matches.map((m) => (
                                        <tr key={m._id} className="border-b border-slate-800/50 transition hover:bg-slate-900/40">
                                            <td className="px-5 py-3 text-white font-medium capitalize">
                                                {m.teamA?.name || "?"} vs {m.teamB?.name || "?"}
                                            </td>
                                            <td className="px-5 py-3 uppercase text-slate-300">{m.format}</td>
                                            <td className={`px-5 py-3 font-semibold capitalize ${statusColors[m.status] || ""}`}>{m.status}</td>
                                            <td className="px-5 py-3 text-slate-300">
                                                {m.matchDate ? new Date(m.matchDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "--"}
                                            </td>
                                            <td className="px-5 py-3 text-slate-300 truncate max-w-[200px]">{m.venue}</td>
                                            <td className="px-5 py-3">
                                                <div className="flex gap-2">
                                                    <button onClick={() => openEdit(m)} className="rounded-lg border border-purple-500/30 bg-purple-500/10 px-3 py-1 text-xs font-semibold text-purple-300 hover:bg-purple-500 hover:text-white">
                                                        Edit
                                                    </button>
                                                    <button onClick={() => handleDelete(m._id)} className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-1 text-xs font-semibold text-red-300 hover:bg-red-500 hover:text-white">
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {totalPages > 1 && (
                            <div className="mt-6 flex justify-center gap-3">
                                <button disabled={page <= 1} onClick={() => setPage(page - 1)}
                                    className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-300 hover:border-purple-400 disabled:opacity-40">
                                    Prev
                                </button>
                                <span className="flex items-center px-4 text-sm text-slate-400">Page {page} of {totalPages}</span>
                                <button disabled={page >= totalPages} onClick={() => setPage(page + 1)}
                                    className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-300 hover:border-purple-400 disabled:opacity-40">
                                    Next
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </section>
    );
}

export default AdminMatches;
