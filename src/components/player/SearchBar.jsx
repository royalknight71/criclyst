

function SearchBar({value,onChange,placeholder}) {
  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

export default SearchBar;