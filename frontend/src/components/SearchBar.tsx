import { SlidersHorizontal } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onToggleFilters: () => void;
}

function SearchBar({ value, onChange, onToggleFilters }: SearchBarProps) {
  return (
    <div className="flex w-full max-w-[327px] h-[38px] items-center gap-2 rounded-lg bg-gray-100 px-4 md:max-w-[343px] md:h-[52px]">
      <input
        type="text"
        placeholder="Search character..."
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="min-w-0 flex-1 text-base md:text-sm text-ink outline-none placeholder:text-muted"
      />
      <button
        type="button"
        onClick={onToggleFilters}
        aria-label="Open filters"
        data-filter-toggle
        className="shrink-0 rounded-full bg-lilac-icon-bg p-2.5 text-violet transition-colors hover:bg-lilac-bg"
      >
        <SlidersHorizontal size={16} />
      </button>
    </div>
  );
}

export default SearchBar;
