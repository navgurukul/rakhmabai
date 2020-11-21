const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const router = express.Router();
const { main } = require("../../utils/offerLetterEmail");
const { olGenerator } = require("../../utils/offerLetterGenerator");

router.post("/generateCertificate", async (req, res, next) => {
  const { name, date } = req.body;
  await olGenerator(name, date);
  res.sendStatus(200);
});
router.post("/sendEmail", async (req, res, next) => {
  const { receiverEmail, name, campus, senderEmail, senderPassword } = req.body;

  await main(receiverEmail, name, campus, senderEmail, senderPassword);
  // Object.keys(allFiles).forEach((key) => {
  //   allFiles[key].forEach((file) => {
  //     fs.unlinkSync(path.join(__dirname, "../../images/", file));
  //   });
  // });

  res.sendStatus(200);
});

module.exports = router;
