const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const router = express.Router();
const { main } = require("../../utils/emailSender");

const campus = {
  Pune: {
    whatsapp_chat_link: "",
    facility_in_charge: {
      name: "",
      number: "",
    },
    location: {},
  },
  Bangalore: {
    whatsapp_chat_link: "",
    facility_in_charge: {
      name: "",
      number: "",
    },
    location: {},
  },
};
router.post("/offerLetter/sendEmail", async (req, res, next) => {
  const { name, date, campus } = req.body;
  await main(
    allFiles.csv[0],
    allFiles.attachments,
    req.body.mailSubject,
    email,
    req.body.email,
    req.body.password
  );
  // Object.keys(allFiles).forEach((key) => {
  //   allFiles[key].forEach((file) => {
  //     fs.unlinkSync(path.join(__dirname, "../../images/", file));
  //   });
  // });

  allFiles = { attachments: [], csv: [] };
  res.sendStatus(200);
});

module.exports = router;
