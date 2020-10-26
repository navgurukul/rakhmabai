const Dotenv = require("dotenv");
Dotenv.config({ path: __dirname + "/.env" });

module.exports = {
  port: process.env.PORT,
  merchantId: process.env.MERCHANT_ID,
  accessKey: process.env.ACCESS_KEY,
  secretKey: process.env.SECRET_KEY,
};
