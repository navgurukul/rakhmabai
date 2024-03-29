const fs = require("fs");
const path = require("path");
const libre = require('libreoffice-convert');
libre.convertAsync = require('util').promisify(libre.convert);

const util = require("util");
const readdir = util.promisify(fs.readdir)

const PizZip = require("pizzip");
const Docxtemplater = require("docxtemplater");

String.prototype.replaceAll = function (search, replacement) {
 var target = this;
 return target.replace(new RegExp(search, "g"), replacement);
};

async function convertHelper(document, exportFct) {
 return await libre.convertAsync(document, '.pdf', undefined);
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

 try {
   const arrayBuffer = await convertHelper(new Uint8Array(buf), "exportPDF");

   const pdfPath = path.join(__dirname, "../assets/offerLetter/pdf/");
   if (!fs.existsSync(pdfPath)) {
     fs.mkdirSync(pdfPath);
   }

   await fs.promises.writeFile(path.resolve(pdfPath + fileName + ".pdf"), new Uint8Array(arrayBuffer));
 } catch (e) {
   console.error(e);
 }
}

async function olGenerator(username, given_date, campus) {
  const docxEditorFolderPath = path.join(__dirname, "docxeditor");

  try {
    const fileNames = await readdir(docxEditorFolderPath);
    const promises = fileNames.map(async (fName) => {
      if (fName.endsWith(".docx")) {
        const campusName = campus + "/" + fName;
        const templatePath = path.join(docxEditorFolderPath, fName);
        const content = fs.readFileSync(templatePath, "binary");

        const zip = new PizZip(content);
        const doc = new Docxtemplater();
        doc.loadZip(zip);
        doc.setOptions({ linebreaks: true });
        await getCertificates(doc, username, given_date, fName.split(".")[0], campus);
      }
    });

    await Promise.all(promises);
  } catch (error) {
    console.error("Error reading files from docxeditor folder:", error);
  }
}


module.exports = { olGenerator };
