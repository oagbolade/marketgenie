import { gql } from "graphql-tag";
const { GraphQLObjectType, GraphQLString } = require("graphql");

export const FileUpload = new GraphQLObjectType({
  name: "FileUpload",
  fields: () => ({
    name: { type: GraphQLString },
    type: { type: GraphQLString },
    size: { type: GraphQLString },
    path: { type: GraphQLString },
  }),
});

export const typeDefs = gql`
  # The implementation for this scalar is provided by the
  # 'GraphQLUpload' export from the 'graphql-upload' package
  # in the resolver map below.
  scalar Upload

  type File {
    filename: String!
    mimetype: String!
    encoding: String!
  }

  type Query {
    # This is only here to satisfy the requirement that at least one
    # field be present within the 'Query' type.  This example does not
    # demonstrate how to fetch uploads back.
    otherFields: Boolean!
  }

  type Mutation {
    # Multiple uploads are supported. See graphql-upload docs for details.
    singleUpload(file: Upload!): File!
  }
`;
