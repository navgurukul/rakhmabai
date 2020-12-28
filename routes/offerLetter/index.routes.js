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
    senderName,
    receiverEmail,
    name,
    campus,
    langType,
    senderEmail,
    senderPassword,
    cc,
  } = req.body;
  let ccArray = [];
  ccArray = cc.replace(" ", "").split(",");
  await main(
    senderName,
    receiverEmail,
    name,
    campus,
    langType,
    senderEmail,
    senderPassword,
    ccArray
  );
  res.sendStatus(200);
});

module.exports = router;
