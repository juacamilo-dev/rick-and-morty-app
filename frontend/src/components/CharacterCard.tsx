import { useMutation } from '@apollo/client';
import { TOGGLE_FAVORITE } from '../graphql/characters';
import type { Character } from '../types/character';

interface CharacterCardProps {
  character: Character;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

function CharacterCard({ character, isSelected, onSelect }: CharacterCardProps) {
  const [toggleFavorite] = useMutation(TOGGLE_FAVORITE, {
    variables: { characterId: character.id },
  });

  const handleToggleFavorite = (event: React.MouseEvent) => {
    event.stopPropagation();
    toggleFavorite();
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onSelect(character.id)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') onSelect(character.id);
      }}
      className={`flex w-full cursor-pointer items-center gap-4 rounded-lg px-6 py-4 md:px-9 text-left transition-colors ${
        isSelected ? 'bg-lilac-bg' : 'hover:bg-gray-50'
      }`}
    >
      <img
        src={character.image}
        alt={character.name}
        className="h-8 w-8 rounded-full object-cover"
      />
      <div className="min-w-0 flex-1">
        <p className="truncate text-base font-semibold text-gray-900">{character.name}</p>
        <p className="truncate text-base font-normal text-gray-500">{character.species}</p>
      </div>
      <button
        type="button"
        onClick={handleToggleFavorite}
        aria-label={character.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        className={`shrink-0 flex h-8 w-8 items-center justify-center rounded-full bg-white p-1 text-xl transition-colors ${
          character.isFavorite ? 'text-heart-green' : 'text-gray-300 hover:text-heart-green'
        }`}
      >
        {character.isFavorite ? '♥' : '♡'}
      </button>
    </div>
  );
}

export default CharacterCard;
