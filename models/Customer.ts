const Sequelize = require("sequelize");
const database = require("./../db/dbConfig.js");

const CustomerModel = database.define("customer", {
  name: {
    type: Sequelize.STRING,
  },
  address: {
    type: Sequelize.STRING,
  },
  isActive: {
    type: Sequelize.STRING,
  },
  age: {
    type: Sequelize.SMALLINT,
  },
});

CustomerModel.sync()
  .then(() => {
    console.log("Customer table created");
  })
  .catch((err: any) => {
    console.log("create customer table error ", err);
  });;

module.exports = CustomerModel;
