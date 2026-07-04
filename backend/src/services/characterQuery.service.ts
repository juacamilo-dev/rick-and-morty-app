import { characterService, type GetCharactersParams } from './character.service';
import { MeasureExecutionTime } from '../utils/measureExecutionTime';

class CharacterQueryService {
  @MeasureExecutionTime
  async search(params: GetCharactersParams) {
    return characterService.getCharacters(params);
  }
}

export const characterQueryService = new CharacterQueryService();
