import type { SortOrder } from '../types/filters';

interface SortControlProps {
  value: SortOrder;
  onChange: (value: SortOrder) => void;
}

function SortControl({ value, onChange }: SortControlProps) {
  return (
    <div className="flex items-center gap-2 text-sm text-gray-400">
      <span>Sort by name:</span>
      <button
        type="button"
        onClick={() => onChange(value === 'ASC' ? null : 'ASC')}
        className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
          value === 'ASC'
            ? 'border-purple-600 bg-purple-600 text-white'
            : 'border-gray-200 bg-gray-100 text-gray-600 hover:bg-purple-100'
        }`}
      >
        A-Z
      </button>
      <button
        type="button"
        onClick={() => onChange(value === 'DESC' ? null : 'DESC')}
        className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
          value === 'DESC'
            ? 'border-purple-600 bg-purple-600 text-white'
            : 'border-gray-200 bg-gray-100 text-gray-600 hover:bg-purple-100'
        }`}
      >
        Z-A
      </button>
    </div>
  );
}

export default SortControl;
