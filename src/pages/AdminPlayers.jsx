import { useState, useEffect } from "react";
import { getPlayers, createPlayer, updatePlayer, deletePlayer } from "../services/player.service";

function AdminPlayers() {
    const [players, setPlayers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalPlayers, setTotalPlayers] = useState(0);
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [editingPlayer, setEditingPlayer] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const defaultForm = {
        name: "", country: "", role: "Batsman",
        battingStyle: "Right-Hand Bat", bowlingStyle: "None",
        matches: 1, runs: "", wickets: "", average: "", strikeRate: 20,
        highestScore: "", image: "", jerseyNumber: "", team: "",
        debutYear: "", isActive: true
    };
    const [form, setForm] = useState(defaultForm);
    const [error, setError] = useState(null);

    useEffect(() => {
        const t = setTimeout(() => setDebouncedSearch(search), 500);
        return () => clearTimeout(t);
    }, [search]);

    useEffect(() => {
        fetchPlayers();
    }, [page, debouncedSearch]);

    async function fetchPlayers() {
        setLoading(true);
        try {
            const data = await getPlayers(page, 10, debouncedSearch);
            setPlayers(data.data);
            setTotalPages(data.totalPages);
            setTotalPlayers(data.totalPlayers);
        } catch (e) {
            setError(e.response?.data?.message || "Failed to load players");
        } finally {
            setLoading(false);
        }
    }

    function openCreate() {
        setEditingPlayer(null);
        setForm({ ...defaultForm });
        setShowForm(true);
        setError(null);
    }

    function openEdit(p) {
        setEditingPlayer(p);
        setForm({
            name: p.name || "", country: p.country || "", role: p.role || "Batsman",
            battingStyle: p.battingStyle || "Right-Hand Bat",
            bowlingStyle: p.bowlingStyle || "None",
            matches: p.matches || 1, runs: p.runs ?? "", wickets: p.wickets ?? "",
            average: p.average ?? "", strikeRate: p.strikeRate || 20,
            highestScore: p.highestScore ?? "", image: p.image || "",
            jerseyNumber: p.jerseyNumber ?? "", team: p.team || "",
            debutYear: p.debutYear || "",
            isActive: p.isActive !== undefined ? p.isActive : true
        });
        setShowForm(true);
        setError(null);
    }

    function sanitizeForm(data) {
        return {
            ...data,
            matches: data.matches === "" ? 1 : Number(data.matches),
            runs: data.runs === "" ? 0 : Number(data.runs),
            wickets: data.wickets === "" ? 0 : Number(data.wickets),
            average: data.average === "" ? 0 : Number(data.average),
            strikeRate: data.strikeRate === "" ? 20 : Number(data.strikeRate),
            highestScore: data.highestScore === "" ? 0 : Number(data.highestScore),
            jerseyNumber: data.jerseyNumber === "" ? undefined : Number(data.jerseyNumber),
            debutYear: data.debutYear === "" ? undefined : Number(data.debutYear),
        };
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setError(null);
        try {
            const payload = sanitizeForm(form);
            if (editingPlayer) {
                await updatePlayer(editingPlayer._id, payload);
            } else {
                await createPlayer(payload);
            }
            setShowForm(false);
            fetchPlayers();
        } catch (err) {
            setError(err.response?.data?.message || "Operation failed");
        }
    }

    async function handleDelete(id) {
        if (!window.confirm("Delete this player?")) return;
        try {
            await deletePlayer(id);
            fetchPlayers();
        } catch (err) {
            alert(err.response?.data?.message || "Delete failed");
        }
    }

    return (
        <section className="relative min-h-screen overflow-hidden bg-[#0B1120]">
            <div className="absolute top-20 left-0 h-96 w-96 rounded-full bg-cyan-500/10 blur-[120px]" />
            <div className="relative mx-auto max-w-6xl px-6 py-16">
                <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="text-cyan-400 font-semibold tracking-[0.2em] uppercase text-sm">Admin</p>
                        <h1 className="mt-2 text-4xl font-black text-white">Manage Players</h1>
                        <p className="mt-2 text-slate-400">{totalPlayers} total players</p>
                    </div>
                    <button onClick={openCreate} className="rounded-xl bg-cyan-500 px-6 py-3 font-semibold text-slate-900 transition hover:bg-cyan-400">
                        + Add Player
                    </button>
                </div>

                <div className="mb-6">
                    <input
                        type="text"
                        placeholder="Search players..."
                        value={search}
                        onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                        className="w-full rounded-xl border border-slate-700 bg-slate-900 px-5 py-3 text-white placeholder-slate-500 outline-none focus:border-cyan-400"
                    />
                </div>

                {showForm && (
                    <div className="mb-8 rounded-2xl border border-slate-700 bg-[#111827] p-6">
                        <h2 className="mb-4 text-xl font-bold text-white">{editingPlayer ? "Edit Player" : "Add Player"}</h2>
                        {error && <p className="mb-4 text-sm text-red-400">{error}</p>}
                        <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {/* Name */}
                            <div>
                                <label className="mb-1 block text-xs uppercase tracking-wider text-slate-400">Name *</label>
                                <input required placeholder="Enter name" value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-2.5 text-white placeholder-slate-500 outline-none focus:border-cyan-400" />
                            </div>
                            {/* Country */}
                            <div>
                                <label className="mb-1 block text-xs uppercase tracking-wider text-slate-400">Country *</label>
                                <input required placeholder="Enter country" value={form.country}
                                    onChange={(e) => setForm({ ...form, country: e.target.value })}
                                    className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-2.5 text-white placeholder-slate-500 outline-none focus:border-cyan-400" />
                            </div>
                            {/* Role */}
                            <div>
                                <label className="mb-1 block text-xs uppercase tracking-wider text-slate-400">Role *</label>
                                <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}
                                    className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-2.5 text-white outline-none focus:border-cyan-400">
                                    <option value="Batsman">Batsman</option>
                                    <option value="Bowler">Bowler</option>
                                    <option value="All-Rounder">All-Rounder</option>
                                    <option value="Wicket-Keeper">Wicket-Keeper</option>
                                </select>
                            </div>
                            {/* Batting Style */}
                            <div>
                                <label className="mb-1 block text-xs uppercase tracking-wider text-slate-400">Batting Style *</label>
                                <select value={form.battingStyle} onChange={(e) => setForm({ ...form, battingStyle: e.target.value })}
                                    className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-2.5 text-white outline-none focus:border-cyan-400">
                                    <option value="Right-Hand Bat">Right-Hand Bat</option>
                                    <option value="Left-Hand Bat">Left-Hand Bat</option>
                                </select>
                            </div>
                            {/* Bowling Style */}
                            <div>
                                <label className="mb-1 block text-xs uppercase tracking-wider text-slate-400">Bowling Style *</label>
                                <select value={form.bowlingStyle} onChange={(e) => setForm({ ...form, bowlingStyle: e.target.value })}
                                    className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-2.5 text-white outline-none focus:border-cyan-400">
                                    <option value="None">None</option>
                                    <option value="Right-arm Fast">Right-arm Fast</option>
                                    <option value="Right-arm Medium">Right-arm Medium</option>
                                    <option value="Right-arm Leg break">Right-arm Leg break</option>
                                    <option value="Right-arm Off break">Right-arm Off break</option>
                                    <option value="Left-arm Fast">Left-arm Fast</option>
                                    <option value="Left-arm Medium">Left-arm Medium</option>
                                    <option value="Left-arm Orthodox">Left-arm Orthodox</option>
                                    <option value="Left-arm Chinaman">Left-arm Chinaman</option>
                                    <option value="Leg Break">Leg Break</option>
                                </select>
                            </div>
                            {/* Matches */}
                            <div>
                                <label className="mb-1 block text-xs uppercase tracking-wider text-slate-400">Matches * <span className="normal-case text-slate-500">(min 1)</span></label>
                                <input required type="number" min="1" placeholder="Enter matches" value={form.matches}
                                    onChange={(e) => setForm({ ...form, matches: e.target.value })}
                                    className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-2.5 text-white placeholder-slate-500 outline-none focus:border-cyan-400" />
                            </div>
                            {/* Runs */}
                            <div>
                                <label className="mb-1 block text-xs uppercase tracking-wider text-slate-400">Runs</label>
                                <input type="number" min="0" placeholder="Enter runs" value={form.runs}
                                    onChange={(e) => setForm({ ...form, runs: e.target.value })}
                                    className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-2.5 text-white placeholder-slate-500 outline-none focus:border-cyan-400" />
                            </div>
                            {/* Wickets */}
                            <div>
                                <label className="mb-1 block text-xs uppercase tracking-wider text-slate-400">Wickets</label>
                                <input type="number" min="0" placeholder="Enter wickets" value={form.wickets}
                                    onChange={(e) => setForm({ ...form, wickets: e.target.value })}
                                    className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-2.5 text-white placeholder-slate-500 outline-none focus:border-cyan-400" />
                            </div>
                            {/* Average */}
                            <div>
                                <label className="mb-1 block text-xs uppercase tracking-wider text-slate-400">Average</label>
                                <input type="number" step="0.01" min="0" placeholder="Enter average" value={form.average}
                                    onChange={(e) => setForm({ ...form, average: e.target.value })}
                                    className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-2.5 text-white placeholder-slate-500 outline-none focus:border-cyan-400" />
                            </div>
                            {/* Strike Rate */}
                            <div>
                                <label className="mb-1 block text-xs uppercase tracking-wider text-slate-400">Strike Rate * <span className="normal-case text-slate-500">(min 20)</span></label>
                                <input required type="number" step="0.01" min="20" placeholder="Enter strike rate" value={form.strikeRate}
                                    onChange={(e) => setForm({ ...form, strikeRate: e.target.value })}
                                    className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-2.5 text-white placeholder-slate-500 outline-none focus:border-cyan-400" />
                            </div>
                            {/* Highest Score */}
                            <div>
                                <label className="mb-1 block text-xs uppercase tracking-wider text-slate-400">Highest Score</label>
                                <input type="number" min="0" placeholder="Enter highest score" value={form.highestScore}
                                    onChange={(e) => setForm({ ...form, highestScore: e.target.value })}
                                    className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-2.5 text-white placeholder-slate-500 outline-none focus:border-cyan-400" />
                            </div>
                            {/* Team */}
                            <div>
                                <label className="mb-1 block text-xs uppercase tracking-wider text-slate-400">Team</label>
                                <input type="text" placeholder="Enter team" value={form.team}
                                    onChange={(e) => setForm({ ...form, team: e.target.value })}
                                    className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-2.5 text-white placeholder-slate-500 outline-none focus:border-cyan-400" />
                            </div>
                            {/* Debut Year */}
                            <div>
                                <label className="mb-1 block text-xs uppercase tracking-wider text-slate-400">Debut Year</label>
                                <input type="number" min="1877" max={new Date().getFullYear()} placeholder="Enter debut year" value={form.debutYear}
                                    onChange={(e) => setForm({ ...form, debutYear: e.target.value })}
                                    className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-2.5 text-white placeholder-slate-500 outline-none focus:border-cyan-400" />
                            </div>
                            {/* Jersey Number */}
                            <div>
                                <label className="mb-1 block text-xs uppercase tracking-wider text-slate-400">Jersey Number</label>
                                <input type="number" min="0" max="99" placeholder="Enter jersey number" value={form.jerseyNumber}
                                    onChange={(e) => setForm({ ...form, jerseyNumber: e.target.value })}
                                    className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-2.5 text-white placeholder-slate-500 outline-none focus:border-cyan-400" />
                            </div>
                            {/* Image URL */}
                            <div>
                                <label className="mb-1 block text-xs uppercase tracking-wider text-slate-400">Image URL</label>
                                <input type="text" placeholder="Enter image URL" value={form.image}
                                    onChange={(e) => setForm({ ...form, image: e.target.value })}
                                    className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-2.5 text-white placeholder-slate-500 outline-none focus:border-cyan-400" />
                            </div>
                            {/* Active */}
                            <div>
                                <label className="mb-1 block text-xs uppercase tracking-wider text-slate-400">Status</label>
                                <label className="flex h-[42px] items-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-4">
                                    <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                                        className="accent-cyan-500" />
                                    <span className="text-sm text-white">Active</span>
                                </label>
                            </div>
                            <div className="flex gap-3 sm:col-span-2 lg:col-span-3">
                                <button type="submit" className="rounded-lg bg-cyan-500 px-6 py-2.5 font-semibold text-slate-900 hover:bg-cyan-400">
                                    {editingPlayer ? "Update" : "Create"}
                                </button>
                                <button type="button" onClick={() => setShowForm(false)} className="rounded-lg border border-slate-700 px-6 py-2.5 font-semibold text-slate-300 hover:border-slate-500">
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {loading ? (
                    <div className="flex justify-center py-20"><div className="h-10 w-10 animate-spin rounded-full border-4 border-cyan-400 border-t-transparent" /></div>
                ) : (
                    <>
                        <div className="overflow-x-auto rounded-2xl border border-slate-800">
                            <table className="w-full text-left text-sm">
                                <thead className="border-b border-slate-800 bg-slate-900/50">
                                    <tr>
                                        <th className="px-5 py-3 font-semibold text-slate-300">Name</th>
                                        <th className="px-5 py-3 font-semibold text-slate-300">Country</th>
                                        <th className="px-5 py-3 font-semibold text-slate-300">Role</th>
                                        <th className="px-5 py-3 font-semibold text-slate-300">Runs</th>
                                        <th className="px-5 py-3 font-semibold text-slate-300">Wickets</th>
                                        <th className="px-5 py-3 font-semibold text-slate-300">Avg</th>
                                        <th className="px-5 py-3 font-semibold text-slate-300">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {players.map((p) => (
                                        <tr key={p._id} className="border-b border-slate-800/50 transition hover:bg-slate-900/40">
                                            <td className="px-5 py-3 capitalize text-white font-medium">{p.name}</td>
                                            <td className="px-5 py-3 capitalize text-slate-300">{p.country}</td>
                                            <td className="px-5 py-3">
                                                <span className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-300">
                                                    {p.role}
                                                </span>
                                            </td>
                                            <td className="px-5 py-3 text-slate-300">{p.runs}</td>
                                            <td className="px-5 py-3 text-slate-300">{p.wickets}</td>
                                            <td className="px-5 py-3 text-slate-300">{p.average}</td>
                                            <td className="px-5 py-3">
                                                <div className="flex gap-2">
                                                    <button onClick={() => openEdit(p)} className="rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-300 hover:bg-cyan-500 hover:text-white">
                                                        Edit
                                                    </button>
                                                    <button onClick={() => handleDelete(p._id)} className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-1 text-xs font-semibold text-red-300 hover:bg-red-500 hover:text-white">
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
                                    className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-300 hover:border-cyan-400 disabled:opacity-40">
                                    Prev
                                </button>
                                <span className="flex items-center px-4 text-sm text-slate-400">Page {page} of {totalPages}</span>
                                <button disabled={page >= totalPages} onClick={() => setPage(page + 1)}
                                    className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-300 hover:border-cyan-400 disabled:opacity-40">
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

export default AdminPlayers;
