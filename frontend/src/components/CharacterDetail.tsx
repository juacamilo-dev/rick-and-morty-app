import { useMutation, useQuery } from '@apollo/client';
import { GET_CHARACTER, TOGGLE_FAVORITE } from '../graphql/characters';
import type { CharacterDetail as CharacterDetailType } from '../types/character';
import CommentSection from './CommentSection';

interface CharacterDetailProps {
  characterId: string;
}

interface GetCharacterData {
  character: CharacterDetailType | null;
}

function CharacterDetail({ characterId }: CharacterDetailProps) {
  const { data, loading, error } = useQuery<GetCharacterData>(GET_CHARACTER, {
    variables: { id: characterId },
  });
  const [toggleFavorite] = useMutation(TOGGLE_FAVORITE, {
    variables: { characterId },
  });

  if (loading) return <p className="text-sm text-gray-500">Loading character...</p>;
  if (error || !data?.character) {
    return <p className="text-sm text-red-500">Character not found.</p>;
  }

  const character = data.character;

  return (
    <div>
      <div className="relative mb-4 h-32 w-32">
        <img
          src={character.image}
          alt={character.name}
          className="h-32 w-32 rounded-full object-cover"
        />
        {character.isFavorite && (
          <span className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-green-500 text-white">
            ♥
          </span>
        )}
      </div>

      <h1 className="mb-4 text-2xl font-semibold text-gray-900">{character.name}</h1>

      <dl className="divide-y divide-gray-100 border-t border-gray-100">
        <div className="py-3">
          <dt className="text-xs text-gray-400">Specie</dt>
          <dd className="text-sm text-gray-800">{character.species}</dd>
        </div>
        <div className="py-3">
          <dt className="text-xs text-gray-400">Status</dt>
          <dd className="text-sm text-gray-800">{character.status}</dd>
        </div>
        <div className="py-3">
          <dt className="text-xs text-gray-400">Origin</dt>
          <dd className="text-sm text-gray-800">{character.origin}</dd>
        </div>
      </dl>

      <button
        type="button"
        onClick={() => toggleFavorite()}
        className={`mt-4 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
          character.isFavorite
            ? 'bg-green-100 text-green-700 hover:bg-green-200'
            : 'bg-gray-100 text-gray-600 hover:bg-purple-100'
        }`}
      >
        {character.isFavorite ? '♥ Favorited' : '♡ Add to favorites'}
      </button>

      <CommentSection characterId={character.id} comments={character.comments} />
    </div>
  );
}

export default CharacterDetail;
