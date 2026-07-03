import { Comment } from '../models';

export const commentService = {
  async addComment(characterId: number, content: string) {
    const comment = await Comment.create({ characterId, content });
    return comment.toJSON();
  },
};
