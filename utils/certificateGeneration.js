require("dotenv").config({ path: `${__dirname}/../.env` });
var PizZip = require("pizzip");
var Docxtemplater = require("docxtemplater");
// const docx = require("@nativedocuments/docx-wasm");
const constants = require("../constants");
var nodemailer = require("nodemailer");
var smtpTransport = require("nodemailer-smtp-transport");


// npm install googleapis@39 --save
const readline = require("readline");
const { google } = require("googleapis");

var fs = require("fs");
var path = require("path");

const libre = require('libreoffice-convert');
libre.convertAsync = require('util').promisify(libre.convert);


String.prototype.replaceAll = function (search, replacement) {
  var target = this;
  return target.replace(new RegExp(search, "g"), replacement);
};

// var transporter = nodemailer.createTransport(
//   smtpTransport({
//     service: "gmail",
//     host: "smtp.gmail.com",
//     auth: {
//       user: "Offerletter@navgurukul.org",
//       pass: "offer_letter22",
//     },
//   })
// );

async function olGenerator(props) {

  // If modifying these scopes, delete token.json.
  const SCOPES = ["https://www.googleapis.com/auth/drive"];

  const TOKEN_PATH = "token.json";
  function main(filePath, fileName) {
    // Load client secrets from a local file.
    fs.readFile("credentials.json", (err, content) => {
      if (err) return console.log("Error loading client secret file:", err);
      // Authorize a client with credentials, then call the Google Drive API.
      authorize(JSON.parse(content), upload, filePath, fileName);
    });
  }

  function authorize(credentials, callback, filePath, fileName) {
    const { client_secret, client_id, redirect_uris } = credentials.web;
    const oAuth2Client = new google.auth.OAuth2(
      client_id,
      client_secret,
      redirect_uris[0]
    );

    // Check if we have previously stored a token.
    fs.readFile(TOKEN_PATH, (err, token) => {
      if (err) return getAccessToken(oAuth2Client, callback, filePath, fileName);
      oAuth2Client.setCredentials(JSON.parse(token));
      callback(oAuth2Client, filePath, fileName);
    });
  }

  function getAccessToken(oAuth2Client, callback, filePath, fileName) {
    const authUrl = oAuth2Client.generateAuthUrl({
      access_type: "offline",
      scope: SCOPES,
    });
    console.log("Authorize this app by visiting this url:", authUrl);
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    rl.question("Enter the code from that page here: ", (code) => {
      rl.close();
      oAuth2Client.getToken(code, (err, token) => {
        if (err) return console.error("Error retrieving access token", err);
        oAuth2Client.setCredentials(token);
        // Store the token to disk for later program executions
        fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
          if (err) return console.error(err);
          console.log("Token stored to", TOKEN_PATH);
        });
        callback(oAuth2Client, filePath, fileName);
      });
    });
  }

  function upload(auth, filePath, fileName) {
    const drive = google.drive({ version: "v3", auth });
    // id of google drive folder in which pdf need to be uploaded
    var folderId = "1yqq3EgnUrwnGkot2WSttsfIjcjf6fZpH";

    var fileMetadata = {
      name: fileName,
      parents: [folderId],
    };
    var media = {
      mimeType: "application/pdf",
      body: fs.createReadStream(filePath),
    };
    drive.files.create(
      {
        resource: fileMetadata,
        media: media,
        fields: "id,name",
      },
      function (err, file) {
        if (err) {
          // Handle error
          console.error(err);
        } else {
          console.log("File Id: ", file.data.id);
          console.log(Name, Date, Workshop, file.data.id)
          // update donor status to `issued` in sheet
        }
      }
    );
  }

  async function convertHelper(document, exportFct) {

    return await libre.convertAsync(document, '.pdf', undefined);
  }
  const { Name, Date, Campus, Workshop, Email } = props

  async function getCertificates(doc) {
    doc.setData({ Name, Date, Campus, Workshop });
    try {
      doc.render();
    } catch (error) {
      var e = {
        message: error.message, name: error.name, stack: error.stack, properties: error.properties,
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
      .then(async (arrayBuffer) => {
        const pdfPath = path.join(__dirname, "../assets/offerLetter/pdf/");
        if (!fs.existsSync(pdfPath)) {
          fs.mkdirSync(pdfPath);
        }
        // buf is a nodejs buffer, you can either write it to a file or do anything else with it.
        // var filePath = path.resolve(pdfPath + "certificate" + ".pdf")
        var filePath = path.resolve(pdfPath + Name + "-" + Date + "-" + Workshop + ".pdf")
        const fileName = (Name + "-" + Date + "-" + Workshop)
        const finalName = [fileName, ".pdf"]
        // console.log(fileName)
        fs.writeFileSync(filePath, new Uint8Array(arrayBuffer));
        // main(filePath,"certificate.pdf")
        // main(filePath, (finalName[0] + finalName[1]))


          // var mailOptions = {
          //   from: `Navgurukul <Offerletter@navgurukul.org>`,
          //   to: Email,
          //   // subject: `Welcome To NavGurukul : Admission Letter`,
          //   subject: `Certificate for ${Name + " on " + Date + " in " + Workshop}`,
          //   html: "",
          //   attachments: [{
          //     fileName: `Certificate.pdf`,
          //     path: filePath,
          //   }],
          //   cc: [],
          // };
          // await transporter.sendMail(mailOptions, function (err, info) {
          //   if (err) console.log(err);
          //   else {
          //     console.log(info);
          //     console.log(Email);
          //   }
          // });
      })

      .catch((e) => {
        console.error(e);
      });
  }

  //Load the docx file as a binary
  const templatePath = path.join(__dirname, "../assets/certificateGeneration/certificate.docx");
  var content = fs.readFileSync(templatePath, "binary");

  var zip = new PizZip(content);

  var doc = new Docxtemplater();
  doc.loadZip(zip);

  doc.setOptions({ linebreaks: true });
  getCertificates(doc);

}

module.exports = { olGenerator };

