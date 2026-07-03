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

export const GET_CHARACTER = gql`
  query GetCharacter($id: ID!) {
    character(id: $id) {
      id
      externalId
      name
      status
      species
      gender
      origin
      image
      isFavorite
      comments {
        id
        content
        createdAt
      }
    }
  }
`;

export const TOGGLE_FAVORITE = gql`
  mutation ToggleFavorite($characterId: ID!) {
    toggleFavorite(characterId: $characterId) {
      id
      isFavorite
    }
  }
`;

export const ADD_COMMENT = gql`
  mutation AddComment($characterId: ID!, $content: String!) {
    addComment(characterId: $characterId, content: $content) {
      id
      content
      createdAt
    }
  }
`;

export const SOFT_DELETE_CHARACTER = gql`
  mutation SoftDeleteCharacter($characterId: ID!) {
    softDeleteCharacter(characterId: $characterId) {
      id
    }
  }
`;
