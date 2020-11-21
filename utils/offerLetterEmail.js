var nodemailer = require("nodemailer");
var smtpTransport = require("nodemailer-smtp-transport");
const { readFile } = require("./fileHandler");
const path = require("path");
const fs = require("fs");

function getHTML(htmlString, receiverName, campus) {
  const campusObj = {
    Pune: {
      whatsapp_chat_link: "https://chat.whatsapp.com/BWIFHhgIpxXDKDRdNQEv6E",
      facility_in_charge: {
        name: "Nitesh",
        number: "+91-8962158723",
      },
      tech_facility_in_charge: {
        name: "Komal",
        number: "+91-7302629612",
      },
      location: {
        address:
          "Flora Institute of Technology, Pune Khed-Shivapur Toll Plaza, Khopi, Maharashtra 412205(Phone: 098906 73701)",
        link: "https://maps.app.goo.gl/PnrmsVXmEgERXdEf7",
      },
    },
    Bangalore: {
      whatsapp_chat_link: "https://chat.whatsapp.com/GedtCO1sM2MBfIUGFvB5RU",
      facility_in_charge: {
        name: "Me",
        number: "+91-8971263283",
      },
      tech_facility_in_charge: {
        name: "Shweta",
        number: "+91-9718602971",
      },
      location: {
        address:
          "45/1, 45/2, Avalahalli Huskur Panchayath, Sarjapura Hobli, Anekal Taluk Dist, Majra Ahir, Bengaluru, Karnataka 560099",
        link: "https://maps.app.goo.gl/aoYyN",
      },
    },
    Dharamshala: {},
  };
  htmlString = htmlString.replace(/USERNAME/g, receiverName);
  htmlString = htmlString.replace(/CAMPUS_OPTION/g, campus);
  htmlString = htmlString.replace(
    /WHATSAPP_CHAT_LINK/g,
    campusObj[campus].whatsapp_chat_link
  );
  htmlString = htmlString.replace(
    /CAMPUS_FACILITY_INCHARGE/g,
    campusObj[campus].facility_in_charge.name
  );
  htmlString = htmlString.replace(
    /CAMPUS_FACILITY_INCHARGE_NUMBER/g,
    campusObj[campus].facility_in_charge.number
  );
  htmlString = htmlString.replace(
    /TECH_FACILITY_INCHARGE/g,
    campusObj[campus].tech_facility_in_charge.name
  );
  htmlString = htmlString.replace(
    /TECH_FACILITY_INCHARGE_NUMBER/g,
    campusObj[campus].tech_facility_in_charge.number
  );
  htmlString = htmlString.replace(
    /CAMPUS_ADDRESS/g,
    campusObj[campus].location.address
  );
  htmlString = htmlString.replace(
    /MAPS_LINK/g,
    campusObj[campus].location.link
  );
  return htmlString;
}

async function main(
  receiverEmail,
  receiverName,
  campus,
  senderEmail,
  senderPassword
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
  };

  const attachmentsDir = path.join(
    __dirname,
    `../images/offerLetter/${campus}`
  );

  const attachmentFiles = fs.readdirSync(attachmentsDir);
  attachmentFiles.forEach((file) => {
    const eachPath = path.join(
      __dirname,
      `../images/offerLetter/${campus}/`,
      file
    );
    mailOptions.attachments.push({
      fileName: file,
      path: eachPath,
    });
  });
  mailOptions.attachments.push({
    fileName: `admission_Letter.pdf`,
    path: path.join(
      __dirname,
      "../images/offerLetter/pdf/admission_letter.pdf"
    ),
  });

  var htmlString = await readFile(__dirname + "/content.html");
  mailOptions.html = getHTML(htmlString, receiverName, campus);
  mailOptions.to = receiverEmail + "<" + receiverEmail + ">";

  await transporter.sendMail(mailOptions, function (err, info) {
    if (err) console.log(err);
    else {
      console.log(info);
      console.log(`Sent to ${receiverName} ${receiverEmail}`);
    }
  });
}

module.exports = { main };
