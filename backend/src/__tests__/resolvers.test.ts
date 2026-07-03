jest.mock('../services/characterQuery.service', () => ({
  characterQueryService: { search: jest.fn() },
}));

// resolvers/index.ts tambien importa character.service, favorite.service, etc.,
// que a su vez abren una conexion real a Redis al importar config/redis.
// Se mockea para que el proceso de test no deje un socket abierto.
jest.mock('../config/redis', () => ({
  redisClient: { get: jest.fn(), set: jest.fn(), keys: jest.fn(), del: jest.fn() },
  CACHE_TTL: 3600,
}));

import { characterQueryService } from '../services/characterQuery.service';
import { resolvers } from '../resolvers';

const mockedSearch = characterQueryService.search as jest.Mock;

describe('resolvers.Query.characters', () => {
  it('delegates to characterQueryService with the given filter and sort', async () => {
    mockedSearch.mockResolvedValue([{ id: '1', name: 'Rick Sanchez' }]);

    const result = await resolvers.Query.characters(null, {
      filter: { species: 'Human' },
      sortByName: 'ASC',
    });

    expect(mockedSearch).toHaveBeenCalledWith({
      filter: { species: 'Human' },
      sortByName: 'ASC',
    });
    expect(result).toEqual([{ id: '1', name: 'Rick Sanchez' }]);
  });

  it('throws a generic error and does not leak internal details when the service fails', async () => {
    mockedSearch.mockRejectedValue(new Error('ER_BAD_FIELD_ERROR: unknown column'));

    await expect(resolvers.Query.characters(null, {})).rejects.toThrow(
      'No se pudieron obtener los personajes.',
    );
  });
});
