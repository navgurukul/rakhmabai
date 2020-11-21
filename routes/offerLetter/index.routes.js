const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const router = express.Router();
const { readFile } = require("../../utils/fileHandler");
const { main } = require("../../utils/offerLetterEmail");

router.post("/offerLetter/sendEmail", async (req, res, next) => {
  const {
    receiverEmail,
    name,
    date,
    campus,
    senderEmail,
    senderPassword,
  } = req.body;

  await main(name, date, campus, senderEmail, senderPassword, attachmentFiles);
  // Object.keys(allFiles).forEach((key) => {
  //   allFiles[key].forEach((file) => {
  //     fs.unlinkSync(path.join(__dirname, "../../images/", file));
  //   });
  // });

  res.sendStatus(200);
});

module.exports = router;
