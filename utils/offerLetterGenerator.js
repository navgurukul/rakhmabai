require("dotenv").config({ path: `${__dirname}/../.env` });
var PizZip = require("pizzip");
var Docxtemplater = require("docxtemplater");
const docx = require("@nativedocuments/docx-wasm");
const constants = require("../constants");

var fs = require("fs");
var path = require("path");

String.prototype.replaceAll = function (search, replacement) {
  var target = this;
  return target.replace(new RegExp(search, "g"), replacement);
};

docx
  .init({
    ND_DEV_ID: constants.nd_dev_id,
    ND_DEV_SECRET: constants.nd_dev_secret,
    ENVIRONMENT: "NODE", // required
    LAZY_INIT: true, // if set to false the WASM engine will be initialized right now, usefull pre-caching (like e.g. for AWS lambda)
  })
  .catch(function (e) {
    console.error(e);
  });

async function olGenerator(username, given_date, campus) {
  async function convertHelper(document, exportFct) {
    const api = await docx.engine();
    await api.load(document);
    const arrayBuffer = await api[exportFct]();
    await api.close();
    return arrayBuffer;
  }

  async function getCertificates(doc, username, given_date, fileName, campus) {
    doc.setData({
      USERNAME: username,
      DATED: given_date,
    });
    try {
      doc.render();
    } catch (error) {
      var e = {
        message: error.message,
        name: error.name,
        stack: error.stack,
        properties: error.properties,
      };
      console.log(JSON.stringify({ error: e }));
      // The error thrown here contains additional information when logged with JSON.stringify (it contains a property object).
      throw error;
    }

    var buf = doc.getZip().generate({ type: "nodebuffer" });
    const docPath = path.join(__dirname, "../assets/offerLetter/docs/");

    if (!fs.existsSync(docPath)) {
      fs.mkdirSync(docPath);
    }
    // fs.writeFileSync(path.resolve(docPath + fileName + ".docx"), buf);
    convertHelper(new Uint8Array(buf), "exportPDF")
      .then((arrayBuffer) => {
        const pdfPath = path.join(__dirname, "../assets/offerLetter/pdf/");
        if (!fs.existsSync(pdfPath)) {
          fs.mkdirSync(pdfPath);
        }
        // buf is a nodejs buffer, you can either write it to a file or do anything else with it.
        fs.writeFileSync(
          path.resolve(pdfPath + fileName + ".pdf"),
          new Uint8Array(arrayBuffer)
        );
      })
      .catch((e) => {
        console.error(e);
      });
  }

  fileNames = ["admission_letter.docx", "admission_letter_only_english.docx"];

  for (var i = 0; i < fileNames.length; i++) {
    var fName = fileNames[i];
    var campusName = campus + "/" + fName;

    //Load the docx file as a binary
    const templatePath = path.join(__dirname, "../document_templates/", campusName);
    var content = fs.readFileSync(templatePath, "binary");

    var zip = new PizZip(content);

    var doc = new Docxtemplater();
    doc.loadZip(zip);

    doc.setOptions({ linebreaks: true });
    getCertificates(doc, username, given_date, fName.split(".")[0], campus);
  }
}

module.exports = { olGenerator };
