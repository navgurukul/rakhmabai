const Dotenv = require("dotenv");
Dotenv.config({ path: __dirname + "/.env" });

module.exports = {
  port: process.env.PORT,
  nd_dev_id: process.env.ND_DEV_ID,
  nd_dev_secret: process.env.ND_DEV_SECRET,
};
