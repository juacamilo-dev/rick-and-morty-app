import { Character } from '../models';
import { characterService } from './character.service';

export const characterAdminService = {
  async softDeleteCharacter(characterId: number) {
    const character = await Character.findByPk(characterId);
    if (!character) {
      throw new Error('Personaje no encontrado');
    }

    character.isDeleted = true;
    await character.save();

    await characterService.invalidateCharactersCache();

    return {
      ...character.toJSON(),
      isFavorite: false,
    };
  },
};
