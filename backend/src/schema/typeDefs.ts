export const typeDefs = `#graphql
  type Character {
    id: ID!
    externalId: Int!
    name: String!
    status: String!
    species: String!
    gender: String!
    origin: String!
    image: String!
    isFavorite: Boolean!
    comments: [Comment!]!
  }

  type Comment {
    id: ID!
    characterId: ID!
    content: String!
    createdAt: String!
  }

  input CharacterFilterInput {
    name: String
    status: String
    species: String
    gender: String
    origin: String
    onlyFavorites: Boolean
  }

  enum SortOrder {
    ASC
    DESC
  }

  type Query {
    characters(filter: CharacterFilterInput, sortByName: SortOrder): [Character!]!
    character(id: ID!): Character
  }

  type Mutation {
    toggleFavorite(characterId: ID!): Character!
    addComment(characterId: ID!, content: String!): Comment!
    softDeleteCharacter(characterId: ID!): Character!
  }
`;
