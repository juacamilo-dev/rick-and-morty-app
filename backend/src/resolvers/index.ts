import { characterService } from '../services/character.service';
import { characterQueryService } from '../services/characterQuery.service';
import { favoriteService } from '../services/favorite.service';
import { commentService } from '../services/comment.service';
import { characterAdminService } from '../services/characterAdmin.service';

export const resolvers = {
  Query: {
    characters: async (_: unknown, args: any) => {
      try {
        return await characterQueryService.search({
          filter: args.filter,
          sortByName: args.sortByName,
        });
      } catch (error) {
        console.error('[Resolver] Error en characters:', error);
        throw new Error('No se pudieron obtener los personajes.');
      }
    },

    character: async (_: unknown, args: { id: string }) => {
      try {
        return await characterService.getCharacterById(Number(args.id));
      } catch (error) {
        console.error('[Resolver] Error en character:', error);
        throw new Error('No se pudo obtener el personaje.');
      }
    },
  },

  Mutation: {
    toggleFavorite: async (_: unknown, args: { characterId: string }) => {
      try {
        return await favoriteService.toggleFavorite(Number(args.characterId));
      } catch (error) {
        console.error('[Resolver] Error en toggleFavorite:', error);
        throw new Error('No se pudo actualizar el favorito.');
      }
    },

    addComment: async (_: unknown, args: { characterId: string; content: string }) => {
      try {
        return await commentService.addComment(Number(args.characterId), args.content);
      } catch (error) {
        console.error('[Resolver] Error en addComment:', error);
        throw new Error('No se pudo agregar el comentario.');
      }
    },

    softDeleteCharacter: async (_: unknown, args: { characterId: string }) => {
      try {
        return await characterAdminService.softDeleteCharacter(Number(args.characterId));
      } catch (error) {
        console.error('[Resolver] Error en softDeleteCharacter:', error);
        throw new Error('No se pudo eliminar el personaje.');
      }
    },
  },
};
