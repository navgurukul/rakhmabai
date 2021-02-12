var nodemailer = require("nodemailer");
var smtpTransport = require("nodemailer-smtp-transport");
const parse = require("csv-parse/lib/sync");
const { readFile } = require("./fileHandler");
const path = require("path");
const _ = require('lodash');

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
    var fileData = await readFile(path.join(__dirname, "../assets/email", csvFile));
    rows = parse(fileData, {
      columns: false,
      trim: true,
      skip_empty_lines: true,
    });
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,3}$/;
    const validatedEmails = rows.filter((item) => emailPattern.test(item[1]));
    // await send_email(validatedEmails, 0, htmlBody);
    return validatedEmails;
  }

  async function getPromises() {
    const promises = [];
    const getValidatedEmails = await sendEmails();
    if (getValidatedEmails.length) {
      _.map(getValidatedEmails, (data) => {
        promises.push(send_email(data, htmlBody));
      })
      await Promise.all(promises);
      // console.log(await Promise.all(promises), "await Promise.all(promises);");
      return({"success": true});
    }
    return false;
  }

  async function send_email(mailId, htmlString) {
    attachmentsFile.forEach((file) => {
      let eachPath = path.join(__dirname, "../assets/email", file);
      mailOptions.attachments.push({
        filename: file,
        path: eachPath,
      });
    });
    if (ccArr.length > 0) {
      mailOptions.cc.push(ccArr);
    }
    mailOptions.html = await getHTML(htmlString, mailId[0]);
    mailOptions.to = mailId[0] + "<" + mailId[1] + ">";

    return await transporter.sendMail(mailOptions)
      .then((res) => {
        console.log(res,"res/n/n");
        return true;
      }).catch((err) => {
        console.log(err);
        return false;
      })
  }
  return await getPromises();
}

module.exports = { main };
