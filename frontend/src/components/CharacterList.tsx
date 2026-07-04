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
    <div className="flex flex-col gap-6">
      {starred.length > 0 && (
        <section>
          <h2 className="sticky top-0 z-10 bg-white py-2 text-xs font-semibold tracking-wide text-gray-400">
            STARRED CHARACTERS ({starred.length})
          </h2>
          <div className="flex flex-col gap-1">
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

      <section>
        <h2 className="sticky top-0 z-10 bg-white py-2 text-xs font-semibold tracking-wide text-gray-400">
          CHARACTERS ({others.length})
        </h2>
        <div className="flex flex-col gap-1">
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
