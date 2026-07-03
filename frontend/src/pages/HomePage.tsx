import { useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_CHARACTERS } from '../graphql/characters';
import type { Character } from '../types/character';
import CharacterList from '../components/CharacterList';

interface GetCharactersData {
  characters: Character[];
}

function HomePage() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { data, loading, error } = useQuery<GetCharactersData>(GET_CHARACTERS);

  return (
    <div className="flex min-h-screen flex-col bg-white md:flex-row">
      <aside className="w-full border-b border-gray-200 p-4 md:w-96 md:border-b-0 md:border-r md:p-6">
        <h1 className="mb-4 text-xl font-semibold text-gray-900">Rick and Morty list</h1>

        {loading && <p className="text-sm text-gray-500">Loading characters...</p>}
        {error && <p className="text-sm text-red-500">Error loading characters.</p>}
        {data && (
          <CharacterList
            characters={data.characters}
            selectedId={selectedId}
            onSelect={setSelectedId}
          />
        )}
      </aside>

      <section className="flex-1 p-6">
        {selectedId ? (
          <p className="text-gray-500">Selected character: {selectedId}</p>
        ) : (
          <p className="text-gray-400">Select a character to see the details.</p>
        )}
      </section>
    </div>
  );
}

export default HomePage;
