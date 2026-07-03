import cron from 'node-cron';
import axios from 'axios';
import { Character } from '../models';
import { characterService } from '../services/character.service';

const API_URL = process.env.RICK_AND_MORTY_API || 'https://rickandmortyapi.com/api';

const updateCharactersFromApi = async (): Promise<void> => {
  console.log('[Cron] Iniciando actualizacion de personajes...');

  try {
    const characters = await Character.findAll({ where: { isDeleted: false } });
    const externalIds = characters.map((c) => c.externalId);

    if (externalIds.length === 0) {
      console.log('[Cron] No hay personajes para actualizar.');
      return;
    }

    const { data } = await axios.get(`${API_URL}/character/${externalIds.join(',')}`);
    const freshCharacters = Array.isArray(data) ? data : [data];

    for (const fresh of freshCharacters) {
      await Character.update(
        {
          name: fresh.name,
          status: fresh.status,
          species: fresh.species,
          gender: fresh.gender,
          origin: fresh.origin?.name || 'unknown',
          image: fresh.image,
        },
        { where: { externalId: fresh.id } }
      );
    }

    await characterService.invalidateCharactersCache();

    console.log(`[Cron] Actualizados ${freshCharacters.length} personajes correctamente.`);
  } catch (error) {
    console.error('[Cron] Error al actualizar personajes:', error);
  }
};

export const startCharacterUpdateCron = (): void => {
  // Corre cada 12 horas: minuto 0, horas 0 y 12
  cron.schedule('0 0,12 * * *', updateCharactersFromApi);
  console.log('[Cron] Job de actualizacion de personajes programado cada 12 horas.');
};
