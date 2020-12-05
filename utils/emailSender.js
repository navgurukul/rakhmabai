var nodemailer = require("nodemailer");
var smtpTransport = require("nodemailer-smtp-transport");
const parse = require("csv-parse/lib/sync");
const { readFile } = require("./fileHandler");
const path = require("path");

async function main(
  csvFile,
  attachmentsFile,
  htmlSubject,
  htmlBody,
  senderEmail,
  senderPassword,
  ccArr
) {
  var transporter = nodemailer.createTransport(
    smtpTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      auth: {
        user: senderEmail,
        pass: senderPassword,
      },
    })
  );

  var mailOptions = {
    from: ` <${senderEmail}>`,
    to: "",
    subject: htmlSubject,
    html: "",
    attachments: [],
    cc: [],
  };

  function getHTML(htmlString, name) {
    if (name.length > 0) name = " " + name;
    return htmlString.replace("username", name);
  }

  var rows = [];

  async function sendEmails() {
    var fileData = await readFile(path.join(__dirname, "../images", csvFile));
    rows = parse(fileData, {
      columns: false,
      trim: true,
      skip_empty_lines: true,
    });
    send_email(rows, 1, htmlBody);
  }

  sendEmails();

  async function send_email(rows, i, htmlString) {
    attachmentsFile.forEach((file) => {
      let eachPath = path.join(__dirname, "../images/", file);
      mailOptions.attachments.push({
        filename: file,
        path: eachPath,
      });
    });
    if (ccArr.indexOf("@") >= 0) {
      mailOptions.cc.push(ccArr);
    }
    mailOptions.html = getHTML(htmlString, rows[i][0]);
    mailOptions.to = rows[i][0] + "<" + rows[i][1] + ">";

    await transporter.sendMail(mailOptions, function (err, info) {
      if (err) console.log(err);
      else {
        console.log(info);
        console.log("Sent", i + 1, "emails. Next index: ", i + 1);

        if (i < rows.length - 1) {
          setTimeout(
            () => send_email(rows, i + 1, htmlString),
            Math.random() * 1000
          );
        }
      }
    });
  }
}

module.exports = { main };
