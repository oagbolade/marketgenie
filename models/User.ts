const UserSequelize = require("sequelize");
const userdatabase = require("./../db/dbConfig.js");

const UserModel = userdatabase.define("user", {
  name: {
    type: UserSequelize.STRING,
    allowNull: false,
  },
  password: {
    type: UserSequelize.STRING(64),
    allowNull: false,
  },
  email: {
    type: UserSequelize.STRING,
    unique: true,
    allowNull: false,
  },
});

UserModel.sync()
  .then(() => {
    console.log("User table created");
  })
  .catch((err: any) => {
    console.log("create user table error ", err);
  });

module.exports = UserModel;
