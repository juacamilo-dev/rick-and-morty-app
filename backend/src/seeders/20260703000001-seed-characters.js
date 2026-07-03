'use strict';

const axios = require('axios');

const CHARACTER_IDS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
const API_URL = process.env.RICK_AND_MORTY_API || 'https://rickandmortyapi.com/api';

module.exports = {
  up: async (queryInterface) => {
    const { data } = await axios.get(
      `${API_URL}/character/${CHARACTER_IDS.join(',')}`
    );

    const now = new Date();

    const characters = data.map((character) => ({
      externalId: character.id,
      name: character.name,
      status: character.status,
      species: character.species,
      gender: character.gender,
      origin: character.origin?.name || 'unknown',
      image: character.image,
      isDeleted: false,
      createdAt: now,
      updatedAt: now,
    }));

    await queryInterface.bulkInsert('characters', characters);
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('characters', null, {});
  },
};
