import { Comment } from '../models';
import { characterService } from './character.service';

export const commentService = {
  async addComment(characterId: number, content: string) {
    const trimmedContent = content.trim();
    if (!trimmedContent) {
      throw new Error('El comentario no puede estar vacio.');
    }

    const comment = await Comment.create({ characterId, content: trimmedContent });

    await characterService.invalidateCharactersCache();

    return {
      ...comment.toJSON(),
      createdAt: comment.createdAt.toISOString(),
    };
  },
};
