import { useMemo, useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_CHARACTERS } from '../graphql/characters';
import type { Character } from '../types/character';
import { DEFAULT_FILTERS, type FilterState, type SortOrder } from '../types/filters';
import CharacterList from '../components/CharacterList';
import SearchBar from '../components/SearchBar';
import SortControl from '../components/SortControl';
import FilterPanel from '../components/FilterPanel';
import CharacterDetail from '../components/CharacterDetail';

interface GetCharactersData {
  characters: Character[];
}

function uniqueSorted(values: string[]): string[] {
  return Array.from(new Set(values)).sort((a, b) => a.localeCompare(b));
}

function HomePage() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [sortOrder, setSortOrder] = useState<SortOrder>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [draftFilters, setDraftFilters] = useState<FilterState>(DEFAULT_FILTERS);

  const { data: optionsData } = useQuery<GetCharactersData>(GET_CHARACTERS);

  const speciesOptions = useMemo(
    () => uniqueSorted(optionsData?.characters.map((c) => c.species) ?? []),
    [optionsData],
  );
  const statusOptions = useMemo(
    () => uniqueSorted(optionsData?.characters.map((c) => c.status) ?? []),
    [optionsData],
  );
  const genderOptions = useMemo(
    () => uniqueSorted(optionsData?.characters.map((c) => c.gender) ?? []),
    [optionsData],
  );

  const { data, loading, error } = useQuery<GetCharactersData>(GET_CHARACTERS, {
    variables: {
      filter: {
        name: name || undefined,
        species: appliedFilters.species || undefined,
        status: appliedFilters.status || undefined,
        gender: appliedFilters.gender || undefined,
      },
      sortByName: sortOrder,
    },
  });

  const displayedCharacters = useMemo(() => {
    const characters = data?.characters ?? [];
    if (appliedFilters.character === 'starred') {
      return characters.filter((character) => character.isFavorite);
    }
    if (appliedFilters.character === 'others') {
      return characters.filter((character) => !character.isFavorite);
    }
    return characters;
  }, [data, appliedFilters.character]);

  const activeFilterCount =
    (appliedFilters.character !== 'all' ? 1 : 0) +
    (appliedFilters.species !== '' ? 1 : 0) +
    (appliedFilters.status !== '' ? 1 : 0) +
    (appliedFilters.gender !== '' ? 1 : 0);

  const handleToggleFilterPanel = () => {
    if (!isPanelOpen) setDraftFilters(appliedFilters);
    setIsPanelOpen(!isPanelOpen);
  };

  const handleApplyFilters = () => {
    setAppliedFilters(draftFilters);
    setIsPanelOpen(false);
  };

  const handleClearFilters = () => {
    setDraftFilters(DEFAULT_FILTERS);
    setAppliedFilters(DEFAULT_FILTERS);
    setName('');
    setIsPanelOpen(false);
  };

  const handleSelectCharacter = (id: string) => {
    setSelectedId((currentId) => (currentId === id ? null : id));
  };

  return (
    <div className="flex min-h-screen flex-col bg-white md:h-screen md:flex-row md:overflow-hidden">
      <aside className="w-full border-b border-gray-200 p-4 md:w-96 md:h-full md:overflow-y-auto md:border-b-0 md:border-r md:p-6">
        <h1 className="mb-4 text-xl font-semibold text-gray-900">Rick and Morty list</h1>

        <div className="relative mb-4 flex items-center justify-between gap-3">
          <SearchBar value={name} onChange={setName} onToggleFilters={handleToggleFilterPanel} />

          {isPanelOpen && (
            <FilterPanel
              draft={draftFilters}
              onChange={setDraftFilters}
              onApply={handleApplyFilters}
              onClear={handleClearFilters}
              onClose={() => setIsPanelOpen(false)}
              speciesOptions={speciesOptions}
              statusOptions={statusOptions}
              genderOptions={genderOptions}
            />
          )}
        </div>

        <div className="mb-4 flex items-center justify-between">
          <SortControl value={sortOrder} onChange={setSortOrder} />
        </div>

        {activeFilterCount > 0 && (
          <div className="mb-4 flex items-center gap-2">
            <span className="text-sm text-gray-500">{displayedCharacters.length} Results</span>
            <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
              {activeFilterCount} Filter{activeFilterCount > 1 ? 's' : ''}
            </span>
          </div>
        )}

        {loading && <p className="text-sm text-gray-500">Loading characters...</p>}
        {error && <p className="text-sm text-red-500">Error loading characters.</p>}
        {data && (
          <CharacterList
            characters={displayedCharacters}
            selectedId={selectedId}
            onSelect={handleSelectCharacter}
          />
        )}
      </aside>

      <section className="hidden flex-1 p-6 md:block md:h-full md:overflow-y-auto">
        {selectedId ? (
          <CharacterDetail characterId={selectedId} onDeleted={() => setSelectedId(null)} />
        ) : (
          <p className="text-gray-400">Select a character to see the details.</p>
        )}
      </section>

      {selectedId && (
        <div className="fixed inset-0 z-40 overflow-y-auto bg-white p-4 md:hidden">
          <button
            type="button"
            onClick={() => setSelectedId(null)}
            aria-label="Back"
            className="mb-4 text-xl"
          >
            ←
          </button>
          <CharacterDetail characterId={selectedId} onDeleted={() => setSelectedId(null)} />
        </div>
      )}
    </div>
  );
}

export default HomePage;
