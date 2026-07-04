import { SlidersHorizontal } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onToggleFilters: () => void;
}

function SearchBar({ value, onChange, onToggleFilters }: SearchBarProps) {
  return (
    <div className="flex w-full items-center gap-2 rounded-xl border border-gray-200 px-3 py-2">
      <input
        type="text"
        placeholder="Search character..."
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="min-w-0 flex-1 text-sm text-ink outline-none placeholder:text-muted"
      />
      <button
        type="button"
        onClick={onToggleFilters}
        aria-label="Open filters"
        data-filter-toggle
        className="shrink-0 rounded-full bg-lilac-icon-bg p-1.5 text-violet transition-colors hover:bg-lilac-bg"
      >
        <SlidersHorizontal size={16} />
      </button>
    </div>
  );
}

export default SearchBar;
