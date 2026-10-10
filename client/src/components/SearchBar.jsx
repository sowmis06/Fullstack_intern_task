import { Search } from "lucide-react";

function SearchBar({ value, onChange }) {
  return (
    <div className="relative flex-1 md:w-64 md:flex-none">
      <Search
        size={16}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
      />
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search templates..."
        className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-9 pr-3 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-brand-500"
      />
    </div>
  );
}

export default SearchBar;
