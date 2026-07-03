jest.mock('../models', () => ({
  Character: { findAll: jest.fn(), findOne: jest.fn() },
  Favorite: {},
  Comment: {},
}));

jest.mock('../config/redis', () => ({
  redisClient: { get: jest.fn(), set: jest.fn(), keys: jest.fn(), del: jest.fn() },
  CACHE_TTL: 3600,
}));

import { Character } from '../models';
import { redisClient } from '../config/redis';
import { characterService } from '../services/character.service';

const mockedCharacterFindAll = Character.findAll as jest.Mock;
const mockedCharacterFindOne = Character.findOne as jest.Mock;
const mockedRedisGet = redisClient.get as jest.Mock;
const mockedRedisSet = redisClient.set as jest.Mock;
const mockedRedisKeys = redisClient.keys as jest.Mock;
const mockedRedisDel = redisClient.del as jest.Mock;

function makeCharacterInstance(overrides: Record<string, unknown> = {}) {
  const data = {
    id: 1,
    externalId: 1,
    name: 'Rick Sanchez',
    status: 'Alive',
    species: 'Human',
    gender: 'Male',
    origin: 'Earth (C-137)',
    image: 'rick.png',
    isDeleted: false,
    ...overrides,
  };
  return { ...data, toJSON: () => data };
}

describe('characterService.getCharacters', () => {
  it('returns cached data without querying the database on a cache hit', async () => {
    const cached = [{ id: 1, name: 'Rick Sanchez', isFavorite: false }];
    mockedRedisGet.mockResolvedValue(JSON.stringify(cached));

    const result = await characterService.getCharacters({});

    expect(result).toEqual(cached);
    expect(mockedCharacterFindAll).not.toHaveBeenCalled();
  });

  it('queries the database and caches the result on a cache miss', async () => {
    mockedRedisGet.mockResolvedValue(null);
    mockedCharacterFindAll.mockResolvedValue([makeCharacterInstance()]);

    const result = await characterService.getCharacters({ filter: { species: 'Human' } });

    expect(mockedCharacterFindAll).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ isDeleted: false, species: 'Human' }),
      }),
    );
    expect(result).toEqual([
      expect.objectContaining({ name: 'Rick Sanchez', isFavorite: false }),
    ]);
    expect(mockedRedisSet).toHaveBeenCalledWith(
      expect.stringContaining('characters:'),
      expect.any(String),
      'EX',
      3600,
    );
  });

  it('marks a character as favorite when it has an associated favorite record', async () => {
    mockedRedisGet.mockResolvedValue(null);
    mockedCharacterFindAll.mockResolvedValue([
      makeCharacterInstance({ favorite: { id: 1 } }),
    ]);

    const [result] = await characterService.getCharacters({});

    expect(result.isFavorite).toBe(true);
  });

  it('applies the requested sort order on the name field', async () => {
    mockedRedisGet.mockResolvedValue(null);
    mockedCharacterFindAll.mockResolvedValue([]);

    await characterService.getCharacters({ sortByName: 'DESC' });

    expect(mockedCharacterFindAll).toHaveBeenCalledWith(
      expect.objectContaining({ order: [['name', 'DESC']] }),
    );
  });
});

describe('characterService.getCharacterById', () => {
  it('returns null when the character does not exist', async () => {
    mockedCharacterFindOne.mockResolvedValue(null);

    const result = await characterService.getCharacterById(999);

    expect(result).toBeNull();
  });

  it('serializes comment dates as ISO strings', async () => {
    const createdAt = new Date('2026-07-03T20:00:00.000Z');
    mockedCharacterFindOne.mockResolvedValue(
      makeCharacterInstance({
        comments: [{ id: 1, characterId: 1, content: 'Wubba lubba dub dub', createdAt }],
      }),
    );

    const result = await characterService.getCharacterById(1);

    expect(result?.comments[0].createdAt).toBe(createdAt.toISOString());
  });
});

describe('characterService.invalidateCharactersCache', () => {
  it('deletes all cached character keys', async () => {
    mockedRedisKeys.mockResolvedValue(['characters:{}', 'characters:{"filter":{}}']);

    await characterService.invalidateCharactersCache();

    expect(mockedRedisDel).toHaveBeenCalledWith('characters:{}', 'characters:{"filter":{}}');
  });

  it('does not call del when there are no cached keys', async () => {
    mockedRedisKeys.mockResolvedValue([]);

    await characterService.invalidateCharactersCache();

    expect(mockedRedisDel).not.toHaveBeenCalled();
  });
});
