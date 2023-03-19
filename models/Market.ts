const Seq = require("sequelize");
const data = require("./../db/dbConfig.js");

const MarketModel = data.define("markets", {
  name: {
    type: Seq.STRING,
  },
  address: {
    type: Seq.STRING,
  },
  population: {
    type: Seq.BIGINT,
  },
});

MarketModel.sync().then(() => {
  console.log("Market table created");
}).catch((err: any) => {
  console.log('create market error ', err);
});

module.exports = MarketModel;
