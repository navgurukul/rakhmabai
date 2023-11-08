
require('dotenv').config({ path: './.env' });
//access the environment variables
const strapiUrl = process.env.strapiUrl;

const express = require("express");
const fs = require("fs");
const path = require("path");
const fsExtra = require("fs-extra");
const axios = require('axios');

const router = express.Router();
const { main } = require("../../utils/offerLetterEmail");
const { editingContent } = require("../../utils/contentUpdating");
const downloadFiles = require("../../utils/fileDownloading");
const { olGenerator } = require("../../utils/offerLetterGenerator");

router.post("/generateCertificate", async (req, res, next) => {
  const { name, date, campus } = req.body;
  console.log(name, date, campus)
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
  // await fsExtra.emptyDir(pdfPath); // Use the asynchronous version here
  res.sendStatus(200);
});

router.post("/admissions", async (req, res, next) => {
  const date = `${new Date().getDate()}-${new Date().getMonth() + 1}-${new Date().getFullYear()}`;

  const [senderEmail, senderPassword, langType] = [
    "Offerletter@navgurukul.org",
    "NavGurukul",
    "both",
  ];

  const { receiverEmail, name, campus, cc } = req.body;
  const response = await axios.get(`${strapiUrl}`);
  let offerLetters = response.data.data;
  offerLetters = offerLetters.filter((item) => 
  item.attributes.campusName.toLowerCase() === req.body.campus.toLowerCase()
);
  const editedOfferLetters = await editingContent(offerLetters);
  await downloadFiles(offerLetters);
  let subjectTitle = offerLetters[0].attributes.subject;
  let ccArray = offerLetters[0].attributes.cc.map(cc => cc.email).flat();
  let data = {
    whatsapp_chat_link: offerLetters[0].attributes.whatsapp_chat_link,
    program_manager_name: offerLetters[0].attributes.program_manager_name,
    program_manager_number: offerLetters[0].attributes.program_manager_number,
    tech_facility_in_charge_name: offerLetters[0].attributes.tech_facility_in_charge_name,
    tech_facility_in_charge_number: offerLetters[0].attributes.tech_facility_in_charge_number,
    address: offerLetters[0].attributes.address,
    location_link: offerLetters[0].attributes.location_link,
  }


  const attachments = offerLetters[0].attributes.attachment;
  const pdfUrlsObject = {};

  attachments.forEach(attachment => {
    const fileName = attachment.files.data.attributes.name;
    const fileExtension = path.extname(fileName).toLowerCase();

    if (fileExtension === '.pdf') {
      const fileNameWithoutExtension = fileName.replace('.pdf', '');
      const key = fileNameWithoutExtension.replace(/_/g, ' '); // Replace underscores with spaces if necessary
      const url = attachment.files.data.attributes.url;

      pdfUrlsObject[key] = url;
    }
  });

  console.log(pdfUrlsObject, '92222222222222222222222');

  // return

  // return
  // const fachaName = {
  //   Dharamshala: "Ram Ashish",
  //   Pune: "Snehati",
  //   Bangalore: "Rupali",
  //   Sarjapura: "Mehak",
  //   Tripura: "Kajal",
  //   Delhi: "Navgurukul",
  //   Amravati: "Atiya",
  //   Dantewada: "Rupali",
  //   Jashpur: "Sakshi",
  //   Udaipur: "Shivani",
  //   Raipur: "Parveen Bano"
  // };

  const senderName = offerLetters[0].attributes.sender_name //fachaName[campus];

  await olGenerator(name, date, campus);

  // let ccArray = ['ujjwalkashyap97987@gmail.com'];
  // ccArray = cc.split(",");
  // console.log(ccArray, '105555555555555')
  try {
    await main(
      senderName,
      receiverEmail,
      name,
      campus,
      langType,
      senderEmail,
      senderPassword,
      ccArray,
      editedOfferLetters,
      subjectTitle,
      data,
      pdfUrlsObject
    );
    const pdfPath = path.join(__dirname, "../../assets/offerLetter/pdf/");
    // await fsExtra.emptyDir(pdfPath); // Use the asynchronous version here
    res.sendStatus(200);
  } catch (err) {
    console.log(err, '>>>>>>>>>>>>>>>>');
    res.status(404).send("Not Found");
  }
});

module.exports = router;
