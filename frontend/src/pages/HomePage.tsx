import { useEffect, useMemo, useRef, useState } from 'react';
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

// Valores reales presentes entre los 15 personajes sembrados (confirmado via GraphQL).
// Evita una segunda query solo para derivar las opciones del FilterPanel.
const SPECIES_OPTIONS = ['Alien', 'Human'];
const STATUS_OPTIONS = ['Alive', 'Dead', 'unknown'];
const GENDER_OPTIONS = ['Female', 'Male', 'unknown'];

function HomePage() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [sortOrder, setSortOrder] = useState<SortOrder>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [draftFilters, setDraftFilters] = useState<FilterState>(DEFAULT_FILTERS);

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

  // Al cargar en desktop, selecciona el primer personaje de la lista para que
  // el panel de detalle no arranque vacio. No corre en mobile (el detalle ahi
  // es una pantalla completa que taparia la lista al entrar) ni de nuevo si el
  // usuario ya deselecciono algo a proposito.
  const hasAutoSelected = useRef(false);
  useEffect(() => {
    if (hasAutoSelected.current || displayedCharacters.length === 0) return;
    if (!window.matchMedia('(min-width: 768px)').matches) return;
    hasAutoSelected.current = true;
    setSelectedId(displayedCharacters[0].id);
  }, [displayedCharacters]);

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
      <aside className="flex w-full flex-col border-b border-gray-200 px-6 py-4 md:w-96 md:h-full md:border-b-0 md:border-r md:px-8 md:py-6">
        <div className="shrink-0">
          <h1 className="mb-4 text-xl font-bold text-ink">Rick and Morty list</h1>

          <div className="relative mb-4 flex items-center justify-between gap-3">
            <SearchBar value={name} onChange={setName} onToggleFilters={handleToggleFilterPanel} />

            {isPanelOpen && (
              <FilterPanel
                draft={draftFilters}
                onChange={setDraftFilters}
                onApply={handleApplyFilters}
                onClear={handleClearFilters}
                onClose={() => setIsPanelOpen(false)}
                speciesOptions={SPECIES_OPTIONS}
                statusOptions={STATUS_OPTIONS}
                genderOptions={GENDER_OPTIONS}
              />
            )}
          </div>

          <div className="mb-2 flex items-center justify-between">
            <SortControl value={sortOrder} onChange={setSortOrder} />
          </div>

          {activeFilterCount > 0 && (
            <div className="mb-2 flex items-center gap-2">
              <span className="text-sm text-muted">{displayedCharacters.length} Results</span>
              <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                {activeFilterCount} Filter{activeFilterCount > 1 ? 's' : ''}
              </span>
            </div>
          )}
        </div>

        <div className="md:min-h-0 md:flex-1 md:overflow-y-auto">
          {loading && <p className="text-sm text-gray-500">Loading characters...</p>}
          {error && <p className="text-sm text-red-500">Error loading characters.</p>}
          {data && (
            <CharacterList
              characters={displayedCharacters}
              selectedId={selectedId}
              onSelect={handleSelectCharacter}
            />
          )}
        </div>
      </aside>

      <section className="hidden flex-1 px-6 py-4 md:block md:h-full md:overflow-y-auto md:px-16 md:py-6">
        {selectedId ? (
          <CharacterDetail characterId={selectedId} onDeleted={() => setSelectedId(null)} />
        ) : (
          <p className="text-muted">Select a character to see the details.</p>
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
