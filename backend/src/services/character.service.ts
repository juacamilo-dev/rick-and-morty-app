import { Op, WhereOptions } from 'sequelize';
import { Character, Favorite, Comment } from '../models';
import type { CharacterAttributes } from '../models/Character';
import { redisClient, CACHE_TTL } from '../config/redis';

interface CharacterFilterInput {
  name?: string;
  status?: string;
  species?: string;
  gender?: string;
  origin?: string;
  onlyFavorites?: boolean;
}

interface GetCharactersParams {
  filter?: CharacterFilterInput;
  sortByName?: 'ASC' | 'DESC';
}

const buildCacheKey = (params: GetCharactersParams): string => {
  return `characters:${JSON.stringify(params)}`;
};

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
      where.name = { [Op.like]: `%${filter.name}%` };
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
      where.origin = { [Op.like]: `%${filter.origin}%` };
    }

    const characters = await Character.findAll({
      where,
      include: [{ model: Favorite, as: 'favorite', required: !!filter?.onlyFavorites }],
      order: sortByName ? [['name', sortByName]] : undefined,
    });

    const result = characters.map((character) => ({
      ...character.toJSON(),
      isFavorite: !!(character as any).favorite,
    }));

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
      comments?: Array<{ id: number; characterId: number; content: string; createdAt: Date }>;
    };

    return {
      ...plainCharacter,
      isFavorite: !!plainCharacter.favorite,
      comments: (plainCharacter.comments || []).map((comment) => ({
        ...comment,
        createdAt: new Date(comment.createdAt).toISOString(),
      })),
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
