import { SlidersHorizontal } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onToggleFilters: () => void;
}

function SearchBar({ value, onChange, onToggleFilters }: SearchBarProps) {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2">
      <input
        type="text"
        placeholder="Search character..."
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="min-w-0 flex-1 text-sm text-gray-700 outline-none placeholder:text-gray-400"
      />
      <button
        type="button"
        onClick={onToggleFilters}
        aria-label="Open filters"
        data-filter-toggle
        className="shrink-0 text-gray-500 hover:text-purple-600"
      >
        <SlidersHorizontal size={18} />
      </button>
    </div>
  );
}

export default SearchBar;
