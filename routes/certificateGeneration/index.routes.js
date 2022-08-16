const express = require("express");
const fs = require("fs");
const path = require("path");
const fsExtra = require("fs-extra");

const router = express.Router();
const { olGenerator } = require("../../utils/certificateGeneration");

router.post("/generateCertificate", async (req, res, next) => {
  // const { Name, Date,Campus,Workshop,Email} = req.body;
  await olGenerator(req.body);
  res.sendStatus(200);
});
module.exports = router;
