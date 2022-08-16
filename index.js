require("dotenv").config({ path: `${__dirname}/.env` });
const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");

const emailApi = require("./routes/email/index.routes");
const whatsappApi = require("./routes/whatsapp/index.routes");
const offerLetterApi = require("./routes/offerLetter/index.routes");
const certificateGeneration = require('./routes/certificateGeneration/index.routes')
const cors = require("cors");

const app = express();

app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use("/", emailApi);
app.use("/whatsapp", whatsappApi);
app.use("/offerLetter", offerLetterApi);
app.use("/certificateGeneration", certificateGeneration);

const port = process.env.PORT || 9000;
app.listen(port, () => {
  console.log("Check out the action at " + `http://localhost:${port}/`);
});
