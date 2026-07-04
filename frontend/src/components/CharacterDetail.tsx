import { useMutation, useQuery } from '@apollo/client';
import { GET_CHARACTER, SOFT_DELETE_CHARACTER, TOGGLE_FAVORITE } from '../graphql/characters';
import type { CharacterDetail as CharacterDetailType } from '../types/character';
import CommentSection from './CommentSection';

interface CharacterDetailProps {
  characterId: string;
  onDeleted: () => void;
}

interface GetCharacterData {
  character: CharacterDetailType | null;
}

function CharacterDetail({ characterId, onDeleted }: CharacterDetailProps) {
  const { data, loading, error } = useQuery<GetCharacterData>(GET_CHARACTER, {
    variables: { id: characterId },
  });
  const [toggleFavorite] = useMutation(TOGGLE_FAVORITE, {
    variables: { characterId },
  });
  const [softDeleteCharacter, { loading: deleting }] = useMutation(SOFT_DELETE_CHARACTER, {
    variables: { characterId },
    refetchQueries: ['GetCharacters'],
    onCompleted: onDeleted,
  });

  const handleDelete = () => {
    if (window.confirm('Delete this character? This can only be undone directly in the database.')) {
      softDeleteCharacter();
    }
  };

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
          <span className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-heart-green text-white">
            ♥
          </span>
        )}
      </div>

      <h1 className="mb-4 text-2xl font-bold text-ink">{character.name}</h1>

      <dl className="divide-y divide-gray-100 border-t border-gray-100">
        <div className="py-3">
          <dt className="text-xs text-muted">Specie</dt>
          <dd className="text-sm text-ink">{character.species}</dd>
        </div>
        <div className="py-3">
          <dt className="text-xs text-muted">Status</dt>
          <dd className="text-sm text-ink">{character.status}</dd>
        </div>
        <div className="py-3">
          <dt className="text-xs text-muted">Origin</dt>
          <dd className="text-sm text-ink">{character.origin}</dd>
        </div>
      </dl>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => toggleFavorite()}
          className={`mt-4 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            character.isFavorite
              ? 'bg-green-100 text-green-700 hover:bg-green-200'
              : 'bg-lilac-icon-bg text-violet hover:bg-lilac-bg'
          }`}
        >
          {character.isFavorite ? '♥ Favorited' : '♡ Add to favorites'}
        </button>

        <button
          type="button"
          onClick={handleDelete}
          disabled={deleting}
          className="mt-4 rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50"
        >
          Delete
        </button>
      </div>

      <CommentSection characterId={character.id} comments={character.comments} />
    </div>
  );
}

export default CharacterDetail;
