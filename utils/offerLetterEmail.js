// var nodemailer = require("nodemailer");
// var smtpTransport = require("nodemailer-smtp-transport");
// const { readFile } = require("./fileHandler");
// const path = require("path");
// const fs = require("fs");

// function getHTML(htmlString, senderName, receiverName, campus, data) {

//   htmlString = htmlString.replace(/SENDERNAME/g, senderName);
//   htmlString = htmlString.replace(/USERNAME/g, receiverName);
//   htmlString = htmlString.replace(/CAMPUS_OPTION/g, campus);
//   htmlString = htmlString.replace(
//     /WHATSAPP_CHAT_LINK/g,
//     data.whatsapp_chat_link
//   );
//   htmlString = htmlString.replace(
//     /CAMPUS_FACILITY_INCHARGE/g,
//     data.program_manager_name
//   );
//   htmlString = htmlString.replace(
//     /CAMPUS_INCHARGE_NUMBER/g,
//     data.program_manager_number
//   );
//   htmlString = htmlString.replace(
//     /TECH_FACILITY_INCHARGE/g,
//     data.tech_facility_in_charge_name
//   );
//   htmlString = htmlString.replace(
//     /TECH_INCHARGE_NUMBER/g,
//     data.tech_facility_in_charge_number
//   );
//   htmlString = htmlString.replace(
//     /CAMPUS_ADDRESS/g,
//     data.address
//   );
//   htmlString = htmlString.replace(
//     /MAPS_LINK/g,
//     data.location_link
//   );
//   return htmlString;
// }

// async function main(
//   senderName,
//   receiverEmail,
//   receiverName,
//   campus,
//   langType,
//   senderEmail,
//   senderPassword,
//   ccArr,
//   emailContent,
//   subjectTitle,
//   data
// ) {
//   console.log(senderName, senderEmail, senderPassword, ccArr);
//   var transporter = nodemailer.createTransport(
//     smtpTransport({
//       service: "gmail",
//       host: "smtp.gmail.com",
//       auth: {
//         user: senderEmail,
//         pass: senderPassword,
//       },
//     })
//   );


//   var mailOptions = {
//     from: `${senderName} <${senderEmail}>`,
//     to: "",
//     subject: subjectTitle,
//     html: "",
//     attachments: [],
//     cc: [],
//   };

//   const attachmentsDir = path.join(
//     __dirname,
//     `pdfeditor`
//   );

//   const attachmentFiles = fs.readdirSync(attachmentsDir);
//   attachmentFiles.forEach((file) => {
//     const eachPath = path.join(
//       __dirname,
//       `pdfeditor/`,
//       file
//     );
//     mailOptions.attachments.push({
//       fileName: file,
//       path: eachPath,
//     });
//   });
//   let offerLetterPDFPath = "";

//   // Not sending addmission letter pdf for Delhi campus
//   if (langType === "both") {
//     offerLetterPDFPath = path.join(
//       __dirname,
//       "../assets/offerLetter/pdf/admission_letter.pdf"
//     );
//   } else if (langType === "onlyEnglish") {
//     offerLetterPDFPath = path.join(
//       __dirname,
//       "../assets/offerLetter/pdf/admission_letter_only_english.pdf"
//     );
//   }

//   mailOptions.attachments.push({
//     fileName: `admission_Letter.pdf`,
//     path: offerLetterPDFPath,
//   });

//   mailOptions.html = getHTML(emailContent, senderName, receiverName, campus, data);
//   mailOptions.to = receiverEmail + "<" + receiverEmail + ">";
//   if (ccArr.length > 0) {
//     mailOptions.cc.push(ccArr);
//   }
//   console.log(mailOptions.attachments, '361111111111 mailOptions')
//   await transporter
//     .sendMail(mailOptions)
//     .then((info) => {
//       console.log(info);
//       console.log(`Sent to ${receiverName} ${receiverEmail}`);
//     })
//   // .catch((error) => {
//   //   console.log(error);
//   // });
// }

// module.exports = { main };






// // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>















var nodemailer = require("nodemailer");
var smtpTransport = require("nodemailer-smtp-transport");
const { readFile } = require("./fileHandler");
const path = require("path");
const fs = require("fs");

function getHTML(htmlString, senderName, receiverName, campus, data) {

  htmlString = htmlString.replace(/SENDERNAME/g, senderName);
  htmlString = htmlString.replace(/USERNAME/g, receiverName);
  htmlString = htmlString.replace(/CAMPUS_OPTION/g, campus);
  htmlString = htmlString.replace(
    /WHATSAPP_CHAT_LINK/g,
    data.whatsapp_chat_link
  );
  htmlString = htmlString.replace(
    /CAMPUS_FACILITY_INCHARGE/g,
    data.program_manager_name
  );
  htmlString = htmlString.replace(
    /CAMPUS_INCHARGE_NUMBER/g,
    data.program_manager_number
  );
  htmlString = htmlString.replace(
    /TECH_FACILITY_INCHARGE/g,
    data.tech_facility_in_charge_name
  );
  htmlString = htmlString.replace(
    /TECH_INCHARGE_NUMBER/g,
    data.tech_facility_in_charge_number
  );
  htmlString = htmlString.replace(
    /CAMPUS_ADDRESS/g,
    data.address
  );
  htmlString = htmlString.replace(
    /MAPS_LINK/g,
    data.location_link
  );
  return htmlString;
}

async function main(
  senderName,
  receiverEmail,
  receiverName,
  campus,
  langType,
  senderEmail,
  senderPassword,
  ccArr,
  emailContent,
  subjectTitle,
  data,
  s3Urls // Pass S3 pdf URLs as an object
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
    from: `${senderName} <${senderEmail}>`,
    to: receiverEmail,
    subject: subjectTitle,
    html: "",
    attachments: [],
    cc: ccArr,
  };

  // Iterate through the S3 URLs object and add them to email attachments
  for (const key in s3Urls) {
    if (s3Urls.hasOwnProperty(key)) {
      const url = s3Urls[key];
      const fileName = key + '.pdf'; // Add .pdf extension to the file name
      mailOptions.attachments.push({
        filename: fileName,
        path: url,
      });
    }
  }

  // Rest of your code remains unchanged


  // const attachmentsDir = path.join(
  //   __dirname,
  //   `pdfeditor`
  // );

  // const attachmentFiles = fs.readdirSync(attachmentsDir);
  // attachmentFiles.forEach((file) => {
  //   const eachPath = path.join(
  //     __dirname,
  //     `pdfeditor/`,
  //     file
  //   );
  //   mailOptions.attachments.push({
  //     fileName: file,
  //     path: eachPath,
  //   });
  // });
  let offerLetterPDFPath = "";

  // Not sending addmission letter pdf for Delhi campus
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


  // ... (existing code remains unchanged)



  mailOptions.html = getHTML(emailContent, senderName, receiverName, campus, data);
  if (ccArr.length > 0) {
    mailOptions.cc.push(ccArr);
  }

  console.log(mailOptions.attachments, 'Attachments');
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(info);
    console.log(`Sent to ${receiverName} ${receiverEmail}`);
  }
  catch (error) {
    console.error('Error sending email:', error);
  }
}

module.exports = { main };
