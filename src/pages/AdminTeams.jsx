import { useState, useEffect } from "react";
import { getTeams, createTeam, updateTeam, deleteTeam } from "../services/team.service";
import { getPlayers } from "../services/player.service";

function AdminTeams() {
    const [teams, setTeams] = useState([]);
    const [allPlayers, setAllPlayers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalTeams, setTotalTeams] = useState(0);
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [editingTeam, setEditingTeam] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({
        name: "", country: "", format: "odi", coach: "", ranking: 1,
        founded: 2000, captain: "", players: [], description: ""
    });
    const [error, setError] = useState(null);

    useEffect(() => {
        const t = setTimeout(() => setDebouncedSearch(search), 500);
        return () => clearTimeout(t);
    }, [search]);

    useEffect(() => {
        fetchTeams();
    }, [page, debouncedSearch]);

    useEffect(() => {
        getPlayers(1, 100).then((d) => setAllPlayers(d.data || [])).catch(() => {});
    }, []);

    async function fetchTeams() {
        setLoading(true);
        try {
            const data = await getTeams(page, 10, debouncedSearch);
            setTeams(data.data);
            setTotalPages(data.totalPages);
            setTotalTeams(data.totalTeams);
        } catch (e) {
            setError(e.response?.data?.message || "Failed to load teams");
        } finally {
            setLoading(false);
        }
    }

    function openCreate() {
        setEditingTeam(null);
        setForm({
            name: "", country: "", format: "odi", coach: "", ranking: 1,
            founded: 2000, captain: "", players: [], description: ""
        });
        setShowForm(true);
        setError(null);
    }

    function openEdit(t) {
        setEditingTeam(t);
        setForm({
            name: t.name || "", country: t.country || "", format: t.format || "odi",
            coach: t.coach || "", ranking: t.ranking || 1, founded: t.founded || 2000,
            captain: t.captain?._id || t.captain || "",
            players: (t.players || []).map((p) => (typeof p === "object" ? p._id : p)),
            description: t.description || ""
        });
        setShowForm(true);
        setError(null);
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setError(null);
        try {
            if (editingTeam) {
                await updateTeam(editingTeam._id, form);
            } else {
                await createTeam(form);
            }
            setShowForm(false);
            fetchTeams();
        } catch (err) {
            setError(err.response?.data?.message || "Operation failed");
        }
    }

    async function handleDelete(id) {
        if (!window.confirm("Delete this team?")) return;
        try {
            await deleteTeam(id);
            fetchTeams();
        } catch (err) {
            alert(err.response?.data?.message || "Delete failed");
        }
    }

    function togglePlayer(playerId) {
        setForm((prev) => {
            const has = prev.players.includes(playerId);
            return { ...prev, players: has ? prev.players.filter((id) => id !== playerId) : [...prev.players, playerId] };
        });
    }

    const inputCls = "rounded-lg border border-slate-700 bg-slate-900 px-4 py-2.5 text-white placeholder-slate-500 outline-none focus:border-cyan-400";

    return (
        <section className="relative min-h-screen overflow-hidden bg-[#0B1120]">
            <div className="absolute top-20 left-0 h-96 w-96 rounded-full bg-green-500/10 blur-[120px]" />
            <div className="relative mx-auto max-w-6xl px-6 py-16">
                <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="text-green-400 font-semibold tracking-[0.2em] uppercase text-sm">Admin</p>
                        <h1 className="mt-2 text-4xl font-black text-white">Manage Teams</h1>
                        <p className="mt-2 text-slate-400">{totalTeams} total teams</p>
                    </div>
                    <button onClick={openCreate} className="rounded-xl bg-green-500 px-6 py-3 font-semibold text-white transition hover:bg-green-400">
                        + Add Team
                    </button>
                </div>

                <div className="mb-6">
                    <input type="text" placeholder="Search teams..." value={search}
                        onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                        className="w-full rounded-xl border border-slate-700 bg-slate-900 px-5 py-3 text-white placeholder-slate-500 outline-none focus:border-green-400" />
                </div>

                {showForm && (
                    <div className="mb-8 rounded-2xl border border-slate-700 bg-[#111827] p-6">
                        <h2 className="mb-4 text-xl font-bold text-white">{editingTeam ? "Edit Team" : "Add Team"}</h2>
                        {error && <p className="mb-4 text-sm text-red-400">{error}</p>}
                        <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            <input required placeholder="Team Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputCls} />
                            <input required placeholder="Country" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} className={inputCls} />
                            <select value={form.format} onChange={(e) => setForm({ ...form, format: e.target.value })} className={inputCls}>
                                <option value="odi">ODI</option>
                                <option value="t20i">T20I</option>
                                <option value="test">Test</option>
                            </select>
                            <input required placeholder="Coach" value={form.coach} onChange={(e) => setForm({ ...form, coach: e.target.value })} className={inputCls} />
                            <input type="number" required placeholder="Ranking (1-20)" min="1" max="20" value={form.ranking} onChange={(e) => setForm({ ...form, ranking: parseInt(e.target.value) || 1 })} className={inputCls} />
                            <input type="number" required placeholder="Founded" min="1800" value={form.founded} onChange={(e) => setForm({ ...form, founded: parseInt(e.target.value) || 2000 })} className={inputCls} />

                            <div className="sm:col-span-2 lg:col-span-3">
                                <label className="mb-1 block text-xs uppercase tracking-wider text-slate-400">Captain</label>
                                <select value={form.captain} onChange={(e) => setForm({ ...form, captain: e.target.value })} className={inputCls + " w-full"}>
                                    <option value="">-- Select Captain --</option>
                                    {allPlayers.map((p) => (
                                        <option key={p._id} value={p._id}>{p.name} ({p.country})</option>
                                    ))}
                                </select>
                            </div>

                            <div className="sm:col-span-2 lg:col-span-3">
                                <label className="mb-2 block text-xs uppercase tracking-wider text-slate-400">Squad Players</label>
                                <div className="max-h-48 overflow-y-auto rounded-lg border border-slate-700 bg-slate-900 p-3">
                                    {allPlayers.length === 0 && <p className="text-sm text-slate-500">No players available</p>}
                                    {allPlayers.map((p) => (
                                        <label key={p._id} className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-slate-800">
                                            <input type="checkbox" checked={form.players.includes(p._id)} onChange={() => togglePlayer(p._id)}
                                                className="accent-green-500" />
                                            <span className="text-sm capitalize text-white">{p.name}</span>
                                            <span className="text-xs text-slate-500">({p.country})</span>
                                        </label>
                                    ))}
                                </div>
                                <p className="mt-1 text-xs text-slate-500">{form.players.length} selected</p>
                            </div>

                            <div className="sm:col-span-2 lg:col-span-3">
                                <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                                    rows={2} className={inputCls + " w-full resize-none"} />
                            </div>

                            <div className="flex gap-3 sm:col-span-2 lg:col-span-3">
                                <button type="submit" className="rounded-lg bg-green-500 px-6 py-2.5 font-semibold text-white hover:bg-green-400">
                                    {editingTeam ? "Update" : "Create"}
                                </button>
                                <button type="button" onClick={() => setShowForm(false)} className="rounded-lg border border-slate-700 px-6 py-2.5 font-semibold text-slate-300 hover:border-slate-500">
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {loading ? (
                    <div className="flex justify-center py-20"><div className="h-10 w-10 animate-spin rounded-full border-4 border-green-400 border-t-transparent" /></div>
                ) : (
                    <>
                        <div className="overflow-x-auto rounded-2xl border border-slate-800">
                            <table className="w-full text-left text-sm">
                                <thead className="border-b border-slate-800 bg-slate-900/50">
                                    <tr>
                                        <th className="px-5 py-3 font-semibold text-slate-300">Name</th>
                                        <th className="px-5 py-3 font-semibold text-slate-300">Country</th>
                                        <th className="px-5 py-3 font-semibold text-slate-300">Format</th>
                                        <th className="px-5 py-3 font-semibold text-slate-300">Rank</th>
                                        <th className="px-5 py-3 font-semibold text-slate-300">Squad</th>
                                        <th className="px-5 py-3 font-semibold text-slate-300">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {teams.map((t) => (
                                        <tr key={t._id} className="border-b border-slate-800/50 transition hover:bg-slate-900/40">
                                            <td className="px-5 py-3 capitalize text-white font-medium">{t.name}</td>
                                            <td className="px-5 py-3 capitalize text-slate-300">{t.country}</td>
                                            <td className="px-5 py-3 uppercase text-slate-300">{t.format}</td>
                                            <td className="px-5 py-3 text-slate-300">{t.ranking}</td>
                                            <td className="px-5 py-3 text-slate-300">{t.players?.length || 0}</td>
                                            <td className="px-5 py-3">
                                                <div className="flex gap-2">
                                                    <button onClick={() => openEdit(t)} className="rounded-lg border border-green-500/30 bg-green-500/10 px-3 py-1 text-xs font-semibold text-green-300 hover:bg-green-500 hover:text-white">
                                                        Edit
                                                    </button>
                                                    <button onClick={() => handleDelete(t._id)} className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-1 text-xs font-semibold text-red-300 hover:bg-red-500 hover:text-white">
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
                                    className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-300 hover:border-green-400 disabled:opacity-40">
                                    Prev
                                </button>
                                <span className="flex items-center px-4 text-sm text-slate-400">Page {page} of {totalPages}</span>
                                <button disabled={page >= totalPages} onClick={() => setPage(page + 1)}
                                    className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-300 hover:border-green-400 disabled:opacity-40">
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

export default AdminTeams;
