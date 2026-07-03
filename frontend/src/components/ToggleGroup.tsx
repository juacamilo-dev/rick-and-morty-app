interface ToggleGroupOption {
  label: string;
  value: string;
}

interface ToggleGroupProps {
  title: string;
  options: ToggleGroupOption[];
  value: string;
  onChange: (value: string) => void;
}

function ToggleGroup({ title, options, value, onChange }: ToggleGroupProps) {
  return (
    <div>
      <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
        {title}
      </h3>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const isActive = option.value === value;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
                isActive
                  ? 'border-purple-600 bg-purple-600 text-white'
                  : 'border-gray-200 bg-gray-100 text-gray-600 hover:bg-purple-100'
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default ToggleGroup;
