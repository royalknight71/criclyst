/**
 * SearchBar.jsx
 *
 * Controlled text input for searching players on the players listing
 * page. Rendered as a styled input with a search icon; the current value
 * and change handler are managed by the parent component.
 */

import { FaSearch } from "react-icons/fa";

/**
 * Renders a controlled search input field.
 * @param {object} props - Component props.
 * @param {string} props.value - Current search query text.
 * @param {function(string): void} props.onChange - Callback invoked with the updated query text on each keystroke.
 * @param {string} [props.placeholder] - Placeholder text shown inside the empty input.
 * @returns {JSX.Element} The search bar element.
 */
function SearchBar({ value, onChange,placeholder }) {
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
        placeholder={placeholder}
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