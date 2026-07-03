import { Favorite } from '../models';
import { characterService } from './character.service';

export const favoriteService = {
  async toggleFavorite(characterId: number) {
    const existing = await Favorite.findOne({ where: { characterId } });

    if (existing) {
      await existing.destroy();
    } else {
      await Favorite.create({ characterId });
    }

    await characterService.invalidateCharactersCache();

    return characterService.getCharacterById(characterId);
  },
};
