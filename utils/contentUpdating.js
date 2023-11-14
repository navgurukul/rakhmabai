var nodemailer = require("nodemailer");
const path = require("path");
const fs = require("fs");


async function editingContent(receive) {
    try {
        
        // removes the tag from strapi and giving proper html tags

        if (Array.isArray(receive) && receive.length > 0) {
            const emailContentString = receive[0].attributes.emailContent;
            const emailContentObject = JSON.parse(emailContentString);

            // Extract text from the parsed JSON object
            const blocks = emailContentObject.blocks;
            const salutation = receive[0].attributes.salutation || '';
            const formattedText = blocks.map(block => {
                if (block.type === 'header') {
                    return `<h2>${block.data.text}</h2>`;
                } else if (block.type === 'paragraph') {
                    return `<p data-selectable-paragraph="">${block.data.text}</p>`;
                } else if (block.type === 'list') {
                    const listItems = block.data.items.map(item => `<li>${item}</li>`).join('');
                    return `<ul>${listItems}</ul>`;
                }
                // Add more conditions for other block types if necessary
            }).join('');

            // Assuming 'formattedText' contains the formatted HTML content
            const finalHTML = `<body>
                ${salutation}&nbsp;<b>USERNAME</b>,<br>
                ${formattedText}
                <br><b>Navgurukul - Aspirational Jobs for all.</b>
            </body>`;

            return finalHTML;

        }
    }
    catch (eachPath) {
        console.log(eachPath, '>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>   ')
    }
}

module.exports = { editingContent };


