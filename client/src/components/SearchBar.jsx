import { useState, useMemo } from "react";
import { Search, SlidersHorizontal, MapPin } from "lucide-react";

const SearchBar = ({ destinations = [], onSelect }) => {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return destinations
      .filter(
        (d) =>
          d.name?.toLowerCase().includes(q) ||
          d.state?.toLowerCase().includes(q)
      )
      .slice(0, 6);
  }, [query, destinations]);

  const handlePick = (dest) => {
    setQuery(dest.name);
    setIsFocused(false);
    onSelect(dest.name);
  };

  return (
    <div className="relative mx-4 mt-4 z-40">
      <div
        className="flex items-center gap-3 rounded-2xl px-4 py-3"
        style={{
          background: "rgba(255,255,255,0.06)",
          border: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <Search size={18} className="text-gray-400 flex-shrink-0" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 150)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && results.length > 0) {
              handlePick(results[0]);
            }
          }}
          placeholder="Search any destination..."
          className="flex-1 bg-transparent outline-none text-white placeholder-gray-500 text-sm"
        />
        <SlidersHorizontal size={18} className="text-gray-400 flex-shrink-0" />
      </div>

      {/* Autocomplete dropdown */}
      {isFocused && query.trim() && (
        <div
          className="absolute left-0 right-0 mt-2 rounded-2xl overflow-hidden"
          style={{
            background: "rgba(15, 13, 31, 0.98)",
            border: "1px solid rgba(255,255,255,0.1)",
            backdropFilter: "blur(20px)",
          }}
        >
          {results.length > 0 ? (
            results.map((dest) => (
              <button
                key={dest._id}
                onMouseDown={() => handlePick(dest)}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors text-left"
              >
                <img
                  src={dest.image}
                  alt={dest.name}
                  className="w-9 h-9 rounded-lg object-cover flex-shrink-0"
                />
                <div className="min-w-0">
                  <div className="text-white text-sm font-medium truncate">
                    {dest.name}
                  </div>
                  <div className="text-gray-400 text-xs flex items-center gap-1">
                    <MapPin size={10} />
                    {dest.state}, {dest.country}
                  </div>
                </div>
              </button>
            ))
          ) : (
            <div className="px-4 py-3 text-gray-500 text-sm">
              No destinations found
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;