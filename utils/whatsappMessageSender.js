const fs = require("fs");
const path = require("path");
const parse = require("csv-parse/lib/sync");
const { readFile } = require("./fileHandler");
const wa = require("@open-wa/wa-automate");
const { ev } = require("@open-wa/wa-automate");

async function waMain(message, peopleCSV, imagesPath) {
  await createClient(message, peopleCSV, imagesPath);
}

async function createClient(message, peopleCSV, imagesPath) {
  wa.create().then((client) => start(client, message, peopleCSV, imagesPath));
  ev.on("qr.**", (data, sessionId, namespace) => {
    const base64data = data.replace(/^data:image\/png;base64,/, "");
    const qrPath = path.join(__dirname, "../qrcode/");
    fs.writeFileSync(path.resolve(qrPath, "qr.png"), base64data, "base64");
    console.log(`${namespace} event detected for session ${sessionId}`, data);
  });
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
