import type { Character } from '../types/character';

interface CharacterCardProps {
  character: Character;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

function CharacterCard({ character, isSelected, onSelect }: CharacterCardProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(character.id)}
      className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors ${
        isSelected ? 'bg-purple-100' : 'hover:bg-gray-50'
      }`}
    >
      <img
        src={character.image}
        alt={character.name}
        className="h-12 w-12 rounded-full object-cover"
      />
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium text-gray-900">{character.name}</p>
        <p className="truncate text-sm text-gray-500">{character.species}</p>
      </div>
      <span
        aria-label={character.isFavorite ? 'Favorite' : 'Not favorite'}
        className={`shrink-0 text-xl ${character.isFavorite ? 'text-green-500' : 'text-gray-300'}`}
      >
        {character.isFavorite ? '♥' : '♡'}
      </span>
    </button>
  );
}

export default CharacterCard;
