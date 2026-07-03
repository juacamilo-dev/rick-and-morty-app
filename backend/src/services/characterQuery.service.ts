import { characterService } from './character.service';
import { MeasureExecutionTime } from '../utils/measureExecutionTime';

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

class CharacterQueryService {
  @MeasureExecutionTime
  async search(params: GetCharactersParams) {
    return characterService.getCharacters(params);
  }
}

export const characterQueryService = new CharacterQueryService();
