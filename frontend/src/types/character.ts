import type { Comment } from './comment';

export interface Character {
  id: string;
  externalId: number;
  name: string;
  status: string;
  species: string;
  gender: string;
  origin: string;
  image: string;
  isFavorite: boolean;
}

export interface CharacterDetail extends Character {
  comments: Comment[];
}
