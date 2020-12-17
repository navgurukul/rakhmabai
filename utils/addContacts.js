require("dotenv").config();
const path = require("path");
const parse = require("csv-parse/lib/sync");
const { readFile } = require("./fileHandler");

const { google } = require("googleapis");

const { OAuth2 } = google.auth;

const oAuth2Client = new OAuth2(process.env.CLIENT_ID, process.env.SECRET_KEY);

oAuth2Client.setCredentials({
  refresh_token: process.env.REFRESH_TOKEN,
});

const people = google.people({ version: "v1", auth: oAuth2Client });

async function addContacts(csvFilePath) {
  const csvPath = path.join(__dirname, "../assets/whatsapp/", csvFilePath);
  let allContacts;
  var csvData = await readFile(csvPath);
  allContacts = parse(csvData, {
    columns: false,
    trim: true,
    skip_empty_lines: true,
  });
  for (let i = 1; i < allContacts.length; i++) {
    let name,
      firstName,
      surname = "";
    let phoneNum = `+91${allContacts[i][1]}`;
    name = allContacts[i][0];
    firstName = allContacts[i][0].split(" ")[0];

    if (allContacts[i][0].split(" ").length > 1) {
      surname = allContacts[i][0].split(" ")[1];
    }

    const { data: newContact } = await people.people.createContact({
      requestBody: {
        phoneNumbers: [{ value: phoneNum }],
        names: [
          {
            displayName: name,
            familyName: surname,
            givenName: firstName,
          },
        ],
      },
    });
    console.log("\n\nCreated Contact:", newContact);
  }
}
async function main(csvPath) {
  await addContacts(csvPath);
  return true;
}
module.exports = { main };
