const express = require("express");
const multer = require("multer");
const fs = require("fs");
const rimraf = require("rimraf");
const path = require("path");
const router = express.Router();
const { main } = require("../../utils/addContacts");
const { waMain, createClient } = require("../../utils/whatsappMessageSender");

const DIR = path.join(__dirname, "../../assets/whatsapp");

let allFiles = { attachments: [], csv: [] };
let randomNum;

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, DIR);
  },
  filename: (req, file, cb) => {
    const fileName = file.originalname.toLowerCase().split(" ").join("-");
    randomNum = Math.random().toString().split(".")[1];
    const fileExtn = fileName.split(".")[1];
    if (
      fileExtn === "pdf" ||
      fileExtn === "jpg" ||
      fileExtn === "jpeg" ||
      fileExtn === "png"
    ) {
      allFiles.attachments.push(randomNum + "-" + fileName);
    }
    if (fileExtn === "csv") {
      allFiles.csv.push(randomNum + "-" + fileName);
    }
    cb(null, randomNum + "-" + fileName);
  },
});

var upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype === "image/png" ||
      file.mimetype === "image/jpg" ||
      file.mimetype === "image/jpeg" ||
      file.mimetype === "application/pdf" ||
      file.mimetype === "text/csv"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error("Only .png, .jpg and .jpeg format allowed!"));
    }
  },
});

router.get("/clearUploads", (req, res) => {
  Object.keys(allFiles).forEach((key) => {
    allFiles[key].forEach((file) => {
      fs.unlinkSync(path.join(__dirname, "../../assets/whatsapp", file));
    });
  });
  allFiles = { attachments: [], csv: [] };
  res.sendStatus(200);
});

router.get("/downloadSample", (req, res) => {
  const random = new Date().getTime().toString();
  const file = path.join(__dirname, "../../assets/samples/whatsapp.csv");
  res.setHeader(
    "Content-disposition",
    `attachment; filename=email_sample${random}.csv`
  );
  res.setHeader("Content-Type", "text/csv");
  res.download(file, `whatsapp_sample${random}.csv`);
});

router.post("/upload", upload.array("waImgCollection", 6), (req, res, next) => {
  const reqFiles = [];
  const url = req.protocol + "://" + req.get("host");
  for (var i = 0; i < req.files.length; i++) {
    reqFiles.push(url + "/assets/whatsapp" + req.files[i].filename);
  }
  res.sendStatus(200);
  console.log("working whatsapp");
});

router.post("/addContacts", async (req, res, next) => {
  await main(allFiles.csv[0]);
  console.log("processing done");
  allFiles = { attachments: [], csv: [] };

  res.sendStatus(200);
});

router.post("/generateQR", async (req, res, next) => {
  const session = path.join(__dirname, "../../session.data.json");
  if (fs.existsSync(session)) {
    fs.unlinkSync(session);
  }

  let message = req.body.message;
  let qr;
  const csvFile = allFiles.csv[0];
  const attachmentsFile = allFiles.attachments;
  allFiles = { attachments: [], csv: [] };

  await createClient(message, csvFile, attachmentsFile, (data) => {
    qr = data;
    try {
      res.send(qr);
    } catch {
      res.end();
    }
  });
  // const whatsappDir = path.join(__dirname, "../../assets/whatsapp");
  // if (fs.existsSync(whatsappDir)) {
  //   rimraf.sync(whatsappDir);
  // }
  // fs.mkdirSync(whatsappDir);
});

router.post("/sendMessage", async (req, res, next) => {
  let message = req.body.message;
  console.log(allFiles.csv[0]);
  await waMain(message, allFiles.csv[0], allFiles.attachments);
  // Object.keys(allFiles).forEach((key) => {
  //   allFiles[key].forEach((file) => {
  //     fs.unlinkSync(path.join(__dirname, "../../assets/whatsapp", file));
  //   });
  // });

  allFiles = { attachments: [], csv: [] };
  res.sendStatus(200);
});

module.exports = router;
