const express = require("express");
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
  const {
    receiverEmail,
    name,
    campus,
    langType,
    senderEmail,
    senderPassword,
  } = req.body;

  await main(
    receiverEmail,
    name,
    campus,
    langType,
    senderEmail,
    senderPassword
  );
  res.sendStatus(200);
});

module.exports = router;
