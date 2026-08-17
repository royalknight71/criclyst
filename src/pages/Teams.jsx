import { useEffect, useState ,useRef} from "react";
import { getTeams } from "../services/team.service.js";
import TeamCard from "../components/team/TeamCard";

const Teams = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [format, setFormat] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});

const firstLoad = useRef(true);

useEffect(() => {
  const fetchTeams = async () => {
    try {
      if (firstLoad.current) {
        setLoading(true);
      }

      setError("");

      const data = await getTeams(
        page,
        8,
        search,
        format
      );

      setTeams(data.data);
      setPagination(data.pagination);

    } catch (err) {
      console.error(err);
      setError("Failed to fetch teams");
    } finally {
      if (firstLoad.current) {
        setLoading(false);
        firstLoad.current = false;
      }
    }
  };

  const timer = setTimeout(() => {
    fetchTeams();
  }, 400);

  return () => clearTimeout(timer);

}, [page, search, format]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#080d1c] px-6 py-20 text-white">
        <div className="flex min-h-[50vh] items-center justify-center">
          <p className="text-lg text-slate-400">
            Loading teams...
          </p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-[#080d1c] px-6 py-20 text-white">
        <div className="flex min-h-[50vh] items-center justify-center">
          <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-6 py-4 text-red-400">
            {error}
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#080d1c] px-6 py-16 text-white">

      {/* ================= HERO ================= */}

      <section className="mx-auto max-w-4xl text-center">

        <p className="text-sm font-semibold tracking-[0.35em] text-cyan-400">
          CRICKET TEAM DATABASE
        </p>

        <h1 className="mt-5 text-4xl font-extrabold leading-tight sm:text-5xl md:text-6xl">
          Explore Cricket
          <span className="block text-blue-500">
            Teams
          </span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-400">
          Explore international cricket teams, captains,
          coaches and team information.
        </p>

      </section>

        <div className="mx-auto mt-12 flex max-w-7xl flex-col gap-4 md:flex-row">

  {/* Search */}
  <div
    className="
      flex flex-1 items-center
      rounded-xl
      border border-slate-700
      bg-[#0f172a]
      px-5
      focus-within:border-cyan-400
    "
  >

    <span className="mr-3 text-xl text-slate-500">
      ⌕
    </span>

    <input
      type="text"
      value={search}
      onChange={(e) => {
        setSearch(e.target.value);
        setPage(1);
      }}
      placeholder="Search teams by name or country..."
      className="
        w-full
        bg-transparent
        py-4
        text-sm text-white
        outline-none
        placeholder:text-slate-500
      "
    />

  </div>


  {/* Format */}
  <select
    value={format}
    onChange={(e) => {
      setFormat(e.target.value);
      setPage(1);
    }}
    className="
      rounded-xl
      border border-slate-700
      bg-[#0f172a]
      px-5 py-4
      text-sm text-slate-200
      outline-none
      focus:border-cyan-400
      md:w-56
    "
  >
    <option value="">All Formats</option>
    <option value="odi">ODI</option>
    <option value="test">Test</option>
    <option value="t20i">T20I</option>
  </select>

</div>
      {/* ================= TEAM COUNT ================= */}

      <div className="mx-auto mt-12 max-w-7xl text-sm text-slate-400">
        Showing{" "}
        <span className="font-semibold text-cyan-400">
          {teams.length}
        </span>{" "}
        Teams
      </div>


      {/* ================= TEAM GRID ================= */}

      <section className="mx-auto mt-6 grid max-w-7xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

        {teams.map((team) => (
          <TeamCard
            key={team._id}
            team={team}
          />
        ))}

      </section>
<div className="mt-10 flex items-center justify-center gap-6">

  <button
    disabled={!pagination.previous}
    onClick={() => setPage(page - 1)}
    className="
      rounded-lg
      border border-slate-700
      px-5 py-2.5
      text-sm text-slate-300
      transition
      hover:border-cyan-400
      hover:text-cyan-400
      disabled:cursor-not-allowed
      disabled:opacity-30
    "
  >
    ← Previous
  </button>

  <span className="text-sm text-slate-400">
    Page{" "}
    <span className="font-semibold text-cyan-400">
      {page}
    </span>
  </span>

  <button
    disabled={!pagination.next}
    onClick={() => setPage(page + 1)}
    className="
      rounded-lg
      border border-slate-700
      px-5 py-2.5
      text-sm text-slate-300
      transition
      hover:border-cyan-400
      hover:text-cyan-400
      disabled:cursor-not-allowed
      disabled:opacity-30
    "
  >
    Next →
  </button>

</div>
    </main>
  );
};

export default Teams;