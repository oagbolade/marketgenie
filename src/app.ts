const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const schema = require("./../schema");
const bodyParser = require("body-parser");
const app = express();
const port = 3005;

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

// app.get("/", (request, response) => {
//   response.json({ info: "Node.js, Express, and Postgres API" });
// });

app.listen(port, () => {
  console.log(`App running on port ${process.env.PORT}.`);
});
