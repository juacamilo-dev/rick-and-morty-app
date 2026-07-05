import type { Character } from '../types/character';
import CharacterCard from './CharacterCard';

interface CharacterListProps {
  characters: Character[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

function CharacterList({ characters, selectedId, onSelect }: CharacterListProps) {
  const starred = characters.filter((character) => character.isFavorite);
  const others = characters.filter((character) => !character.isFavorite);

  return (
    <div className="flex flex-col">
      {starred.length > 0 && (
        <section>
          <h2 className="sticky top-0 z-10 bg-white px-6 py-2 md:px-9 text-xs font-semibold tracking-wide text-muted">
            STARRED CHARACTERS ({starred.length})
          </h2>
          <div className="divide-y divide-gray-200">
            {starred.map((character) => (
              <CharacterCard
                key={character.id}
                character={character}
                isSelected={character.id === selectedId}
                onSelect={onSelect}
              />
            ))}
          </div>
        </section>
      )}

      <section className={starred.length > 0 ? 'mt-8' : ''}>
        <h2 className="sticky top-0 z-10 bg-white px-6 py-2 md:px-9 text-xs font-semibold tracking-wide text-muted">
          CHARACTERS ({others.length})
        </h2>
        <div className="divide-y divide-gray-200">
          {others.map((character) => (
            <CharacterCard
              key={character.id}
              character={character}
              isSelected={character.id === selectedId}
              onSelect={onSelect}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

export default CharacterList;
