import { gql } from '@apollo/client';

export const GET_CHARACTERS = gql`
  query GetCharacters($filter: CharacterFilterInput, $sortByName: SortOrder) {
    characters(filter: $filter, sortByName: $sortByName) {
      id
      externalId
      name
      status
      species
      gender
      origin
      image
      isFavorite
    }
  }
`;
