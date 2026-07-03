import { Comment } from '../models';

export const commentService = {
  async addComment(characterId: number, content: string) {
    const trimmedContent = content.trim();
    if (!trimmedContent) {
      throw new Error('El comentario no puede estar vacio.');
    }

    const comment = await Comment.create({ characterId, content: trimmedContent });
    return {
      ...comment.toJSON(),
      createdAt: comment.createdAt.toISOString(),
    };
  },
};
