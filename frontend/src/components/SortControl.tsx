import type { SortOrder } from '../types/filters';

interface SortControlProps {
  value: SortOrder;
  onChange: (value: SortOrder) => void;
}

function SortControl({ value, onChange }: SortControlProps) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="text-gray-400">Sort by name:</span>
      <button
        type="button"
        onClick={() => onChange(value === 'ASC' ? null : 'ASC')}
        className={`rounded-md px-2 py-1 ${value === 'ASC' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-600'}`}
      >
        A-Z
      </button>
      <button
        type="button"
        onClick={() => onChange(value === 'DESC' ? null : 'DESC')}
        className={`rounded-md px-2 py-1 ${value === 'DESC' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-600'}`}
      >
        Z-A
      </button>
    </div>
  );
}

export default SortControl;
