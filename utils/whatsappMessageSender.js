const fs = require("fs");
const path = require("path");
const parse = require("csv-parse/lib/sync");
const { readFile } = require("./fileHandler");
const wa = require("@open-wa/wa-automate");
const { ev } = require("@open-wa/wa-automate");

async function waMain(message, peopleCSV, imagesPath) {
  await createClient(message, peopleCSV, imagesPath, cb);
}

async function createClient(message, peopleCSV, imagesPath, cb) {
  wa.create().then((client) => start(client, message, peopleCSV, imagesPath));
  ev.on("qr.**", (data) => {
    cb(data);
  });
  return;
}

async function start(client, message, peopleCSV, imagesPath) {
  console.log(peopleCSV, imagesPath, message);
  const csvPath = path.join(__dirname, "../images/whatsapp/", peopleCSV);
  let allContacts;
  var csvData = await readFile(csvPath);
  allContacts = parse(csvData, {
    columns: false,
    trim: true,
    skip_empty_lines: true,
  });
  for (let i = 1; i < allContacts.length; i++) {
    const number = `91${allContacts[i][1]}@c.us`;
    client.sendText(number, message);

    if (imagesPath.length > 0) {
      imagesPath.forEach((image) => {
        const imagePath = path.join(__dirname, "../images/whatsapp", image);
        const fileName = image;
        const caption = image;
        client.sendImage(number, imagePath, fileName, caption);
      });
    }
  }
}

module.exports = { waMain, createClient, start };
