require("dotenv").config();

module.exports = {
  PORT: process.env.PORT,
  JWT_SECRET: process.env.JWT_SECRET,
  MONGO_DB_URI: process.env.MONGO_DB_URI,
  MONGO_TEST_DB_URI: process.env.MONGO_TEST_DB_URI
};
