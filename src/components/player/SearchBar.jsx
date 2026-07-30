import { FaSearch } from "react-icons/fa";

function SearchBar({ value, onChange }) {
  return (
    <div className="relative w-full">

      <FaSearch
        className="
          absolute
          left-5
          top-1/2
          -translate-y-1/2
          text-slate-500
          text-sm
          pointer-events-none
        "
      />

      <input
        type="text"
        placeholder="Search players by name, country or team..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="
          w-full
          rounded-2xl
          border
          border-slate-700
          bg-slate-900/60
          py-4
          pl-14
          pr-5
          text-white
          placeholder:text-slate-500
          outline-none
          backdrop-blur-md
          transition-all
          duration-300
          focus:border-cyan-400
          focus:ring-4
          focus:ring-cyan-500/10
        "
      />

    </div>
  );
}

export default SearchBar;