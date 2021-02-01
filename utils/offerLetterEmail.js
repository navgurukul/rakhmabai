var nodemailer = require("nodemailer");
var smtpTransport = require("nodemailer-smtp-transport");
const { readFile } = require("./fileHandler");
const path = require("path");
const fs = require("fs");
const Queue = require('bull');

function getHTML(htmlString, senderName, receiverName, campus) {
  const campusObj = {
    Pune: {
      whatsapp_chat_link: "https://chat.whatsapp.com/BWIFHhgIpxXDKDRdNQEv6E",
      program_manager: {
        name: "Cheshta Sharma",
        number: "+91-9829331810",
      },
      tech_facility_in_charge: {
        name: "Shahnaaz",
        number: "+91-97317 39220",
      },
      location: {
        address:
          "Flora Institute of Technology, Pune Khed-Shivapur Toll Plaza, Khopi, Maharashtra 412205 (Phone: 098906 73701)",
        link: "https://maps.app.goo.gl/PnrmsVXmEgERXdEf7",
      },
    },
    Bangalore: {
      whatsapp_chat_link: "https://chat.whatsapp.com/GedtCO1sM2MBfIUGFvB5RU",
      program_manager: {
        name: "Kittiy",
        number: "+91-8097109453",
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
    Dharamshala: {
      program_manager: {
        name: "Me",
        number: "+91-9354978726",
      },
      tech_facility_in_charge: {
        name: "",
        number: "",
      },
      location: {
        address:
          "Ward number 202, Sukkhad (Garh, Dharamshala, Himachal Pradesh 176057)",
        link: "https://goo.gl/maps/dyvEyYt8V1jtDD1L8",
      },
    },
  };
  htmlString = htmlString.replace(/SENDERNAME/g, senderName);
  htmlString = htmlString.replace(/USERNAME/g, receiverName);
  htmlString = htmlString.replace(/CAMPUS_OPTION/g, campus);
  htmlString = htmlString.replace(
    /WHATSAPP_CHAT_LINK/g,
    campusObj[campus].whatsapp_chat_link
  );
  htmlString = htmlString.replace(
    /CAMPUS_FACILITY_INCHARGE/g,
    campusObj[campus].program_manager.name
  );
  htmlString = htmlString.replace(
    /CAMPUS_INCHARGE_NUMBER/g,
    campusObj[campus].program_manager.number
  );
  htmlString = htmlString.replace(
    /TECH_FACILITY_INCHARGE/g,
    campusObj[campus].tech_facility_in_charge.name
  );
  htmlString = htmlString.replace(
    /TECH_INCHARGE_NUMBER/g,
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

// const redis = require('redis');
// const config = {
//     host: '127.0.0.1',
//     port: 6379,
//   };
  
// const client = redis.createClient(config);

async function main(
  senderName,
  receiverEmail,
  receiverName,
  campus,
  langType,
  senderEmail,
  senderPassword,
  ccArr
) {
  console.log(senderName, senderEmail, senderPassword);

  const sendMailQueue = new Queue('sendMail');
  async function addUserToQueue(emailData) {
      console.log(emailData, "emailData");
      sendMailQueue.add(emailData);
      return sendMailQueue;
  }

  const emailData = {senderName,receiverEmail,receiverName,campus,langType,senderEmail,senderPassword,ccArr}
  const userData = await addUserToQueue(emailData);

  // Consumer
  userData.process(async job => {
    console.log(job.data, "job.data", job.id, "job.id"); 
    return await sendMail(job.data);  
  });

  function sendMail(details) {

    var transporter = nodemailer.createTransport(
      smtpTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        auth: {
          user: details.senderEmail,
          pass: details.senderPassword,
        },
      })
    );
  
    var mailOptions = {
      from: `${details.senderName} <${details.senderEmail}>`,
      to: "",
      subject: `Welcome To NavGurukul : Admission Letter`,
      html: "",
      attachments: [],
      cc: [],
    };
  
    const attachmentsDir = path.join(
      __dirname,
      `../assets/offerLetter/${details.campus}`
    );
  
    const attachmentFiles = fs.readdirSync(attachmentsDir);
    attachmentFiles.forEach((file) => {
      const eachPath = path.join(
        __dirname,
        `../assets/offerLetter/${details.campus}/`,
        file
      );
      mailOptions.attachments.push({
        fileName: file,
        path: eachPath,
      });
    });
    let offerLetterPDFPath = "";
    if (langType === "both") {
      offerLetterPDFPath = path.join(
        __dirname,
        "../assets/offerLetter/pdf/admission_letter.pdf"
      );
    } else if (langType === "onlyEnglish") {
      offerLetterPDFPath = path.join(
        __dirname,
        "../assets/offerLetter/pdf/admission_letter_only_english.pdf"
      );
    }
    mailOptions.attachments.push({
      fileName: `admission_Letter.pdf`,
      path: offerLetterPDFPath,
    });
  
    let htmlString;
    if (details.campus === "Pune") {
      htmlString = readFile(__dirname + "/emailContent/pune.html"); // await removed
    } else if (details.campus === "Bangalore") {
      htmlString = readFile(__dirname + "/emailContent/bangalore.html"); // await removed
    } else if (details.campus === "Dharamshala") {
      htmlString = readFile(__dirname + "/emailContent/dharamshala.html"); // await removed
    }
    mailOptions.html = getHTML(htmlString, details.senderName, details.receiverName, details.campus);
    mailOptions.to = details.receiverEmail + "<" + details.receiverEmail + ">";
    if (details.ccArr.length > 0) {
      mailOptions.cc.push(details.ccArr);
    }
  
    // await transporter.sendMail(mailOptions, function (err, info) {
    //   if (err) console.log(err);
    //   else {
    //     console.log(info);
    //     console.log(`Sent to ${receiverName} ${receiverEmail}`);
    //   }
    // });

    return new Promise((resolve, reject) => {
      transporter.sendMail(mailOptions, (err, info) => {
          // setTimeout(() => {console.log("2 sec ho gye")}, 2000);
          if (err) {
              reject(err);
          } else {
              console.log(info, "info\n\n\n\n");
              resolve(info);
          }
      });
    });
  }

  
}

module.exports = { main };
