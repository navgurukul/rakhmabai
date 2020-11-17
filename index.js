const express = require("express");
const bodyParser = require("body-parser");

const emailApi = require("./routes/email/index.routes");
const whatsappApi = require("./routes/whatsapp/index.routes");
const cors = require("cors");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use("/", emailApi);
app.use("/whatsapp", whatsappApi);

const port = process.env.PORT || 9000;
app.listen(port, () => {
  console.log("Connected to port " + port);
});
