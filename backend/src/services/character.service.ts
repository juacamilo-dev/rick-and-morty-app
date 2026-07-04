import { Op, WhereOptions } from 'sequelize';
import { Character, Favorite, Comment } from '../models';
import type { CharacterAttributes } from '../models/Character';
import { redisClient, CACHE_TTL } from '../config/redis';

export interface CharacterFilterInput {
  name?: string;
  status?: string;
  species?: string;
  gender?: string;
  origin?: string;
  onlyFavorites?: boolean;
}

export interface GetCharactersParams {
  filter?: CharacterFilterInput;
  sortByName?: 'ASC' | 'DESC';
}

const buildCacheKey = (params: GetCharactersParams): string => {
  return `characters:${JSON.stringify(params)}`;
};

// Escapa los comodines propios de SQL LIKE (%, _) para que una busqueda por
// texto se trate como literal y no como patron (ej. buscar "%" no debe traer
// todos los personajes).
const escapeLikePattern = (value: string): string => value.replace(/[%_]/g, '\\$&');

type RawComment = { id: number; characterId: number; content: string; createdAt: Date };

// Sequelize devuelve `createdAt` como Date; el schema GraphQL lo tipa String!,
// asi que se serializa a ISO aqui antes de que graphql-js intente coaccionarlo
// (Date.valueOf() da epoch en vez de ISO si no se convierte primero).
const serializeComments = (comments: RawComment[] = []) =>
  comments.map((comment) => ({
    ...comment,
    createdAt: new Date(comment.createdAt).toISOString(),
  }));

export const characterService = {
  async getCharacters(params: GetCharactersParams) {
    const cacheKey = buildCacheKey(params);

    const cached = await redisClient.get(cacheKey);
    if (cached) {
      console.log(`[Cache] HIT -> ${cacheKey}`);
      return JSON.parse(cached);
    }

    console.log(`[Cache] MISS -> ${cacheKey}`);

    const where: WhereOptions = { isDeleted: false };
    const { filter, sortByName } = params;

    if (filter?.name) {
      where.name = { [Op.like]: `%${escapeLikePattern(filter.name)}%` };
    }
    if (filter?.status) {
      where.status = filter.status;
    }
    if (filter?.species) {
      where.species = filter.species;
    }
    if (filter?.gender) {
      where.gender = filter.gender;
    }
    if (filter?.origin) {
      where.origin = { [Op.like]: `%${escapeLikePattern(filter.origin)}%` };
    }

    const characters = await Character.findAll({
      where,
      include: [
        { model: Favorite, as: 'favorite', required: !!filter?.onlyFavorites },
        { model: Comment, as: 'comments' },
      ],
      order: sortByName ? [['name', sortByName]] : undefined,
    });

    const result = characters.map((character) => {
      const plainCharacter = character.toJSON() as CharacterAttributes & {
        favorite?: unknown;
        comments?: RawComment[];
      };

      return {
        ...plainCharacter,
        isFavorite: !!plainCharacter.favorite,
        comments: serializeComments(plainCharacter.comments),
      };
    });

    await redisClient.set(cacheKey, JSON.stringify(result), 'EX', CACHE_TTL);

    return result;
  },

  async getCharacterById(id: number) {
    const character = await Character.findOne({
      where: { id, isDeleted: false },
      include: [
        { model: Favorite, as: 'favorite' },
        { model: Comment, as: 'comments' },
      ],
    });

    if (!character) return null;

    // toJSON() ya convierte las asociaciones incluidas (favorite, comments) a objetos
    // planos; el tipado de CharacterAttributes no las declara, por eso el cast.
    const plainCharacter = character.toJSON() as CharacterAttributes & {
      favorite?: unknown;
      comments?: RawComment[];
    };

    return {
      ...plainCharacter,
      isFavorite: !!plainCharacter.favorite,
      comments: serializeComments(plainCharacter.comments),
    };
  },

  async invalidateCharactersCache() {
    const keys = await redisClient.keys('characters:*');
    if (keys.length > 0) {
      await redisClient.del(...keys);
      console.log(`[Cache] Invalidadas ${keys.length} claves de personajes.`);
    }
  },
};
