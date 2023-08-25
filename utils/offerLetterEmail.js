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
        name: "Snehati",
        number: "+91-9881357582",
      },
      tech_facility_in_charge: {
        // name: "Nilam",
        // number: "+91-7349513911",
      },
      location: {
        address:
          "Anish Jadhav Memorial Foundation Gharkul Properties, Plot No. 60/1/1, Survey No 60, Pathare Wasti, Lohegaon,Pune, Maharashtra 411047",
        link: "https://g.co/kgs/774bwu",
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
        name: "Mehak",
        number: "+91-89567 68895",
      },
      tech_facility_in_charge: {
        // name: "V.kumar nayak",
        // number: "+91-9492116836",
      },
      location: {
        address:
          "No. 68/16A of Halanayakana Halli village Varthur, East, Taluk, Uttarahalli Hobli, Bengaluru, Karnataka 560035.",
        link: "https://maps.app.goo.gl/aoYyN",
      },
    },
    Dharamshala: {
      whatsapp_chat_link: "https://chat.whatsapp.com/BjO1NMCXStM999HVrkUNX4",
      program_manager: {
        name: "Ram Ashish Chauhan",
        number: "+91-8052628214",
      },
      tech_facility_in_charge: {
        name: "",
        number: "",
      },
      location: {
        address:
          "Ward number 202, Sukkhad (Garh, Dharamshala, Himachal Pradesh 176057)",
        link: "https://goo.gl/maps/dG8G1gs2DyzQhWCCA",
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
    Amravati: {
      whatsapp_chat_link: "https://chat.whatsapp.com/Bvom0itZjfoIIx644hb8cz",
      program_manager: {
        name: "Atiya",
        number: "9353615437",
      },
      tech_facility_in_charge: {
        //   name: "Shahnaaz",
        //   number: "+91-9028829220",
      },
      location: {
        address: "Dr.Panjabrao Deshmukh Administrative Prabodhini,Amravati",
        link: "https://g.co/kgs/rCnNoj",
      },
    },
    Dantewada: {
      whatsapp_chat_link: "https://chat.whatsapp.com/EAgBUxF9Nh0BNLil33Gnzt)",
      program_manager: {
        name: "Rupali",
        number: "6361620437",
      },
      tech_facility_in_charge: {
        //   name: "Shahnaaz",
        //   number: "+91-9028829220",
      },
      location: {
        address: "YUVA BPO, EDUCATION CITY, JAWANGA, Geedam Dantewada, Chhattisgarh 494441",
        link: "https://goo.gl/maps/zggPcVZcc97ykCDB8",
      },
    },
    Udaipur: {
      whatsapp_chat_link: "https://chat.whatsapp.com/CQxVZlbKCv19P8E08IBCdu)",
      program_manager: {
        name: "Shivani",
        number: "7414945048",
      },
      tech_facility_in_charge: {
        //   name: "Shahnaaz",
        //   number: "+91-9028829220",
      },
      location: {
        // address: "",
        link: "https://goo.gl/maps/fjtQSexmngedNeyv5",
      },
    },
    Raipur: {
      whatsapp_chat_link: "https://chat.whatsapp.com/KISRz8ercOZKqGFojogmmN)",
      program_manager: {
        name: "Parveen Bano",
        number: "8793660708",
      },
      tech_facility_in_charge: {
        //   name: "Shahnaaz",
        //   number: "+91-9028829220",
      },
      location: {
        address: "Yog Bhawan, VIP Rd, near Agrasen Dham II, Fundahar",
        link: "https://goo.gl/maps/5ACXcqhgFGLG1z1s8",
      },
    },
    Jashpur: {
      whatsapp_chat_link: "https://chat.whatsapp.com/HTC2cNdJML0KZOnX4xaalc",
      program_manager: {
        name: "Sakshi",
        // number: "",
      },
      tech_facility_in_charge: {
        //   name: "Shahnaaz",
        //   number: "+91-9028829220",
      },
      location: {
        // address: "",
        link: "https://maps.app.goo.gl/snhQdsDh8p4PtLft7",
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

  let subjectTitle;
  if (campus == "Udaipur") {
    subjectTitle = "Offer Letter - Abhilasha Program Udaipur Campus"
  } else {
    subjectTitle = "Welcome To NavGurukul : Admission Letter"
  }

  var mailOptions = {
    from: `${senderName} <${senderEmail}>`,
    to: "",
    subject: subjectTitle,
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
  } else if (campus === "Amravati") {
    htmlString = await readFile(__dirname + "/emailContent/amravati.html");
  } else if (campus === "Dantewada") {
    htmlString = await readFile(__dirname + "/emailContent/dantewada.html");
  } else if (campus === "Jashpur") {
    htmlString = await readFile(__dirname + "/emailContent/jashpur.html");
  } else if (campus === "Udaipur") {
    htmlString = await readFile(__dirname + "/emailContent/udaipur.html");
  } else if (campus === "Raipur") {
    htmlString = await readFile(__dirname + "/emailContent/raipur.html");
  }
  mailOptions.html = getHTML(htmlString, senderName, receiverName, campus);
  mailOptions.to = receiverEmail + "<" + receiverEmail + ">";
  if (ccArr.length > 0) {
    if (campus === "Delhi") {
      ccArr.push('ngadmissions@dseu.ac.in')
    }
    else if (campus === "Amravati") {
      ccArr.push('amravaticampusteam@navgurukul.org')
    }
    else if (campus === "Pune") {
      ccArr.push('puneteam@navgurukul.org')
    }
    else if (campus === "Bangalore") {
      ccArr.push('bangalore_admissions@navgurukul.org')
    }
    else if (campus === "Sarjapura") {
      ccArr.push('Sarjapur_team@navgurukul.org')
    }
    else if (campus === "Tripura") {
      ccArr.push('tripura-team@navgurukul.org')
    }
    else if (campus === "Jashpur") {
      ccArr.push('Jashpur_admissions@navgurukul.org')
    }
    else if (campus === "Dantewada") {
      ccArr.push('dantewada_admissions@navgurukul.org')
    }
    else if (campus === "Udaipur") {
      ccArr.push('udaipur_admissions@navgurukul.org')
    }
    else if (campus === "Dharamshala") {
      ccArr.push('dharamshala_admissions@navgurukul.org')
    }
    else if (campus === "Raipur") {
      ccArr.push('Parveenbano21@navgurukul.org')
    }

    mailOptions.cc.push(ccArr);
  }


  await transporter
    .sendMail(mailOptions)
    .then((info) => {
      console.log(info);
      console.log(`Sent to ${receiverName} ${receiverEmail}`);
    })
  // .catch((error) => {
  //   console.log(error);
  // });
}

module.exports = { main };
