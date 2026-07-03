export type CharacterGroupFilter = 'all' | 'starred' | 'others';

export interface FilterState {
  character: CharacterGroupFilter;
  species: string;
  status: string;
  gender: string;
  name: string;
}

export const DEFAULT_FILTERS: FilterState = {
  character: 'all',
  species: '',
  status: '',
  gender: '',
  name: '',
};

export type SortOrder = 'ASC' | 'DESC' | null;
