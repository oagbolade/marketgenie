const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const schema = require("./../schema");
const bodyParser = require("body-parser");
const path = require("path");

// Upload Imports
// import { graphqlExpress } from "graphql-server-express";
const { apolloUploadExpress } = require("apollo-upload-server");
const {typeDefs} = require("./../schema/types");
const {resolvers} = require("./../resolvers");
const { ApolloServer } = require("apollo-server-express");
const {
  GraphQLUpload,
  graphqlUploadExpress, // A Koa implementation is also exported.
} = require("graphql-upload");
const { ApolloServerPluginLandingPageLocalDefault } = require("apollo-server-core");

const app = express();

// Database
const db = require('./../db/dbConfig.js');

// Test DB
db.authenticate()
  .then(() => console.log('Database connected...'))
  .catch((err: string) => console.log('Error: ' + err));

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    graphiql: process.env.NODE_ENV === "development",
  })
);

app.listen(process.env.PORT, () => {
  console.log(`App running on port ${process.env.PORT}.`);
});

async function startServer() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    // Using graphql-upload without CSRF prevention is very insecure.
    csrfPrevention: false,
    cache: "bounded",
    // plugins: [ApolloServerPluginLandingPageLocalDefault({ embed: true })],
  });
  await server.start();

  const app = express();

  // This middleware should be added before calling `applyMiddleware`.
  app.use(graphqlUploadExpress());

  server.applyMiddleware({ app });

  await new Promise<void>((r) =>
    app.listen({ port: process.env.UPLOAD_PORT }, r)
  );

  console.log(
    `🚀 Upload server ready at http://localhost:${process.env.UPLOAD_PORT}${server.graphqlPath}`
  );
}

startServer();
