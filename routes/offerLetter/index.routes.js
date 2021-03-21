const express = require("express");
const fs = require("fs");
const path = require("path");
const fsExtra = require("fs-extra");

const router = express.Router();
const { main } = require("../../utils/offerLetterEmail");
const { olGenerator } = require("../../utils/offerLetterGenerator");

router.post("/generateCertificate", async (req, res, next) => {
  const { name, date, campus } = req.body;
  await olGenerator(name, date, campus);
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
  const pdfPath = path.join(__dirname, "../../assets/offerLetter/pdf/");
  await fsExtra.emptyDirSync(pdfPath);
  res.sendStatus(200);
});

router.post("/admissions/offerLetter", async (req, res, next) => {
  const date = `${new Date().getDate()} - ${new Date().getMonth() + 1}`;

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

  await olGenerator(name, date, campus);

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
  const pdfPath = path.join(__dirname, "../../assets/offerLetter/pdf/");
  await fsExtra.emptyDirSync(pdfPath);
  res.sendStatus(200);
});

module.exports = router;
