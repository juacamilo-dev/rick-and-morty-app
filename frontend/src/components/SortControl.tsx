import type { SortOrder } from '../types/filters';

interface SortControlProps {
  value: SortOrder;
  onChange: (value: SortOrder) => void;
}

function SortControl({ value, onChange }: SortControlProps) {
  return (
    <div className="flex items-center gap-2 text-sm text-muted">
      <span>Sort by name:</span>
      <button
        type="button"
        onClick={() => onChange(value === 'ASC' ? null : 'ASC')}
        className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
          value === 'ASC'
            ? 'border-violet bg-violet text-white'
            : 'border-gray-200 bg-gray-100 text-muted hover:bg-lilac-bg'
        }`}
      >
        A-Z
      </button>
      <button
        type="button"
        onClick={() => onChange(value === 'DESC' ? null : 'DESC')}
        className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
          value === 'DESC'
            ? 'border-violet bg-violet text-white'
            : 'border-gray-200 bg-gray-100 text-muted hover:bg-lilac-bg'
        }`}
      >
        Z-A
      </button>
    </div>
  );
}

export default SortControl;
