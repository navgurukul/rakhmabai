var nodemailer = require("nodemailer");
var smtpTransport = require("nodemailer-smtp-transport");
const { readFile } = require("./fileHandler");
const path = require("path");
const fs = require("fs");

function getHTML(htmlString, senderName, receiverName, campus) {
  const campusObj = {
    Pune: {
      whatsapp_chat_link: "https://chat.whatsapp.com/KRmQztBN8JfLC0Xu39Ly9P",
      program_manager: {
        name: "Nilam",
        number: "+91-7349513911",
      },
      tech_facility_in_charge: {
        // name: "Nilam",
        // number: "+91-7349513911",
      },
      location: {
        address:
          "Sr. No. 45, Gujarwadi, Narmada city, near Waghjai Temple, Katraj, Pune, Maharashtra 411046",
        link: "https://g.co/kgs/RKkFW3",
      },
    },
    Bangalore: {
      whatsapp_chat_link: "https://chat.whatsapp.com/GedtCO1sM2MBfIUGFvB5RU",
      program_manager: {
        name: "Samyukta Mutunary",
        number: "+91-88821 20780",
      },
      tech_facility_in_charge: {
        // name: "Shweta",
        // number: "+91-9718602971",
      },
      location: {
        address:
          "45/1, 45/2, Avalahalli Huskur Panchayath, Sarjapura Hobli, Anekal Taluk Dist, Majra Ahir, Bengaluru, Karnataka 560099",
        link: "https://maps.app.goo.gl/aoYyN",
      },
    },
    Sarjapura: {
      whatsapp_chat_link: "https://chat.whatsapp.com/GedtCO1sM2MBfIUGFvB5RU",
      program_manager: {
        name: "Rajalakshmi",
        number: "+91-9902435764",
      },
      tech_facility_in_charge: {
        // name: "V.kumar nayak",
        // number: "+91-9492116836",
      },
      location: {
        address:
          "45/1, 45/2, Avalahalli Huskur Panchayath, Sarjapura Hobli, Anekal Taluk Dist, Majra Ahir, Bengaluru, Karnataka 560099",
        link: "https://maps.app.goo.gl/aoYyN",
      },
    },
    Dharamshala: {
      program_manager: {
        name: "Nitesh",
        number: "+91-8962158723",
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
    Tripura: {
      whatsapp_chat_link: "https://chat.whatsapp.com/EHdgUM6CFg7IoibqiAuxc1",
      program_manager: {
        name: "Kittiy",
        number: "+91-8097109453",
      },
      tech_facility_in_charge: {
        //   name: "Shahnaaz",
        //   number: "+91-9028829220",
      },
      location: {
        address: "V76M+J95, Kunjaban Township, Agartala, Tripura 799010",
        link: "https://g.co/kgs/Jvh8o9",
      },
    },
    Delhi: {
      whatsapp_chat_link: "",
      program_manager: {
        // name: "",
        // number: "",
      },
      tech_facility_in_charge: {
        //   name: "Shahnaaz",
        //   number: "+91-9028829220",
      },
      location: {
        // address: "",
        // link: "",
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
    to: "",
    subject: `Welcome To NavGurukul : Admission Letter`,
    html: "",
    attachments: [],
    cc: [],
  };

  const attachmentsDir = path.join(
    __dirname,
    `../assets/offerLetter/${campus}`
  );

  const attachmentFiles = fs.readdirSync(attachmentsDir);
  attachmentFiles.forEach((file) => {
    const eachPath = path.join(
      __dirname,
      `../assets/offerLetter/${campus}/`,
      file
    );
    mailOptions.attachments.push({
      fileName: file,
      path: eachPath,
    });
  });
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

  let htmlString;
  if (campus === "Pune") {
    htmlString = await readFile(__dirname + "/emailContent/pune.html");
  } else if (campus === "Bangalore") {
    htmlString = await readFile(__dirname + "/emailContent/bangalore.html");
  } else if (campus === "Sarjapura") {
    htmlString = await readFile(__dirname + "/emailContent/sarjapura.html");
  } else if (campus === "Dharamshala") {
    htmlString = await readFile(__dirname + "/emailContent/dharamshala.html");
  } else if (campus === "Tripura") {
    htmlString = await readFile(__dirname + "/emailContent/tripura.html");
  } else if (campus === "Delhi") {
    htmlString = await readFile(__dirname + "/emailContent/delhi.html");
  }
  mailOptions.html = getHTML(htmlString, senderName, receiverName, campus);
  mailOptions.to = receiverEmail + "<" + receiverEmail + ">";
  if (ccArr.length > 0) {
    mailOptions.cc.push(ccArr);
  }

  // await transporter.sendMail(mailOptions, function (err, info) {
  //   if (err) console.log(err);
  //   else {
  //     console.log(info);
  //     console.log(`Sent to ${receiverName} ${receiverEmail}`);
  //   }
  // })
  await transporter
    .sendMail(mailOptions)
    .then((info) => {
      console.log(info);
      console.log(`Sent to ${receiverName} ${receiverEmail}`);
    })
    .catch((error) => {
      console.log(error);
    });
}

module.exports = { main };
