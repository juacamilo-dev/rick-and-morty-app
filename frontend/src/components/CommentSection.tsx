import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { ADD_COMMENT, GET_CHARACTER } from '../graphql/characters';
import type { Comment } from '../types/comment';

interface CommentSectionProps {
  characterId: string;
  comments: Comment[];
}

function formatDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function CommentSection({ characterId, comments }: CommentSectionProps) {
  const [content, setContent] = useState('');
  const [addComment, { loading }] = useMutation(ADD_COMMENT, {
    refetchQueries: [{ query: GET_CHARACTER, variables: { id: characterId } }],
  });

  const handleSubmit = async () => {
    if (!content.trim()) return;
    await addComment({ variables: { characterId, content: content.trim() } });
    setContent('');
  };

  return (
    <div className="mt-8">
      <h2 className="mb-2 text-sm font-semibold text-gray-500">Comments</h2>
      <textarea
        value={content}
        onChange={(event) => setContent(event.target.value)}
        placeholder="Write a comment..."
        rows={3}
        className="w-full resize-none rounded-lg border border-gray-200 p-3 text-sm text-gray-700 outline-none focus:border-purple-400"
      />
      <button
        type="button"
        onClick={handleSubmit}
        disabled={loading || !content.trim()}
        className="mt-2 rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-purple-700 disabled:opacity-50"
      >
        Comment
      </button>

      <div className="mt-4 flex flex-col gap-3">
        {comments.map((comment) => (
          <div key={comment.id} className="border-b border-gray-100 pb-3">
            <p className="text-sm text-gray-700">{comment.content}</p>
            <p className="mt-1 text-xs text-gray-400">{formatDate(comment.createdAt)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CommentSection;
