import { useEffect, useRef } from 'react';
import type { FilterState } from '../types/filters';
import ToggleGroup from './ToggleGroup';

const CHARACTER_OPTIONS = [
  { label: 'All', value: 'all' },
  { label: 'Starred', value: 'starred' },
  { label: 'Others', value: 'others' },
];

interface FilterPanelProps {
  draft: FilterState;
  onChange: (draft: FilterState) => void;
  onApply: () => void;
  onClear: () => void;
  onClose: () => void;
  speciesOptions: string[];
  statusOptions: string[];
  genderOptions: string[];
}

function toOptions(values: string[]) {
  return [{ label: 'All', value: '' }, ...values.map((value) => ({ label: value, value }))];
}

function FilterPanelContent({
  draft,
  onChange,
  onApply,
  onClear,
  speciesOptions,
  statusOptions,
  genderOptions,
}: Omit<FilterPanelProps, 'onClose'>) {
  return (
    <div className="flex flex-col gap-5">
      <ToggleGroup
        title="Character"
        options={CHARACTER_OPTIONS}
        value={draft.character}
        onChange={(value) => onChange({ ...draft, character: value as FilterState['character'] })}
      />
      <ToggleGroup
        title="Specie"
        options={toOptions(speciesOptions)}
        value={draft.species}
        onChange={(value) => onChange({ ...draft, species: value })}
      />
      <ToggleGroup
        title="Status"
        options={toOptions(statusOptions)}
        value={draft.status}
        onChange={(value) => onChange({ ...draft, status: value })}
      />
      <ToggleGroup
        title="Gender"
        options={toOptions(genderOptions)}
        value={draft.gender}
        onChange={(value) => onChange({ ...draft, gender: value })}
      />

      <div className="flex gap-2">
        <button
          type="button"
          onClick={onClear}
          className="flex-1 rounded-lg border border-gray-300 py-2.5 font-medium text-gray-600 transition-colors hover:bg-gray-50 active:bg-gray-100"
        >
          Clear filters
        </button>
        <button
          type="button"
          onClick={onApply}
          className="flex-1 rounded-lg bg-gray-200 py-2.5 font-medium text-gray-700 transition-colors hover:bg-purple-200 active:bg-purple-600 active:text-white"
        >
          Filter
        </button>
      </div>
    </div>
  );
}

function FilterPanel(props: FilterPanelProps) {
  const { onClose } = props;
  // Envuelve ambas variantes (desktop y mobile) para que un clic dentro de
  // cualquiera de las dos cuente como "dentro" del panel.
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  return (
    <div ref={panelRef} className="contents">
      {/* Desktop dropdown: closing without clicking "Filter" discards the draft selection */}
      <div className="absolute right-0 top-full z-20 mt-2 hidden w-80 rounded-xl border border-gray-200 bg-white p-4 shadow-lg md:block">
        <FilterPanelContent {...props} />
      </div>

      {/* Mobile full-screen */}
      <div className="fixed inset-0 z-30 flex flex-col bg-white p-4 md:hidden">
        <div className="mb-4 flex items-center gap-3">
          <button type="button" onClick={onClose} aria-label="Back" className="text-xl">
            ←
          </button>
          <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
        </div>
        <FilterPanelContent {...props} />
      </div>
    </div>
  );
}

export default FilterPanel;
