const Dotenv = require("dotenv");
Dotenv.config({ path: __dirname + "/.env" });

module.exports = {
  port: process.env.PORT,
};
