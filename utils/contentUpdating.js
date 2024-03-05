var nodemailer = require("nodemailer");
const path = require("path");
const fs = require("fs");


async function editingContent(receive) {
    try {
        
        // removes the tag from strapi and giving proper html tags

        if (Array.isArray(receive) && receive.length > 0) {

            const emailContentString = receive[0].attributes.emailContent;
            console.log(typeof emailContentString, '>>>>>>>>>>>>>>>>>>>')
            var formattedText =  await convertTags(emailContentString);
            // const emailContentObject = JSON.parse(emailContentString);
            // //Extract text from the parsed JSON object
            // const blocks = emailContentObject.blocks;
            const salutation = receive[0].attributes.salutation || '';
            // const formattedText = blocks.map(block => {
            //     if (block.type === 'header') {
            //         return `<h2>${block.data.text}</h2>`;
            //     } else if (block.type === 'paragraph') {
            //         return `<p data-selectable-paragraph="">${block.data.text}</p>`;
            //     } else if (block.type === 'list') {
            //         const listItems = block.data.items.map(item => `<li>${item}</li>`).join('');
            //         return `<ul>${listItems}</ul>`;
            //     }
            //     // Add more conditions for other block types if necessary
            // }).join('');

            // Assuming 'formattedText' contains the formatted HTML content
            const finalHTML = `<body>
                ${salutation}&nbsp;<b>USERNAME</b>,<br>
                ${formattedText}
                <br><b>Navgurukul - Aspirational Jobs for all.</b>
            </body>`;

            console.log(finalHTML ,"44444444444")
            return finalHTML;

        }
    }
    catch (eachPath) {
        console.log(eachPath, '>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>   ')
    }


    function convertTags(html) {
        const lines = html.split('</p>').filter(Boolean);
        const result = lines.map(line => `<p data-selectable-paragraph="">${line}</p>`);
        return result.join('');
      }
      
      const formatefinal = convertTags(formateone);
      
}

module.exports = { editingContent };


