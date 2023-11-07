const axios = require('axios');
const fs = require('fs');
const path = require('path');

async function downloadFiles(response) {
    try {
        // const response = await axios.get('https://merd-strapi.merakilearn.org/api/offer-letters?populate=cc,attachment.files');

        let offerLetters = response;
        // offerLetters = offerLetters.filter((item) => item.attributes.campusName == 'Dantewada');
        // console.log(offerLetters, '>>>>>>>>>>>>')

        // Define the destination folder
        const pdfFolder = path.join(__dirname, 'pdfeditor');
        const docxFolder = path.join(__dirname, 'docxeditor');

        // Clear the destination folders
        clearFolder(pdfFolder);
        clearFolder(docxFolder);

        for (const offerLetter of offerLetters) {
            const attachments = offerLetter.attributes.attachment;
            // console.log(attachments,'>>>>>>>>>>>>')
            for (const key in attachments) {
                if (attachments.hasOwnProperty(key)) {
                    const attachment = attachments[key];
                    // console.log(attachment, '>>>>>>>>>>>>');
                    const fileUrl = attachment.files.data.attributes.url;
                    // console.log(fileUrl, '>>>>>>>');
                    const fileName = attachment.files.data.attributes.name;
                    const fileExtension = path.extname(fileName);
                    const destinationFolder = fileExtension === '.pdf' ? pdfFolder : docxFolder;

                    // Create the destination folder if it doesn't exist
                    if (!fs.existsSync(destinationFolder)) {
                        fs.mkdirSync(destinationFolder, { recursive: true });
                    }

                    const filePath = path.join(destinationFolder, fileName);

                    const fileResponse = await axios({
                        url: fileUrl,
                        method: 'GET',
                        responseType: 'stream',
                    });

                    const writer = fs.createWriteStream(filePath);
                    fileResponse.data.pipe(writer);

                    await new Promise((resolve, reject) => {
                        writer.on('finish', resolve);
                        writer.on('error', reject);
                    });

                    console.log(`File downloaded: ${filePath}`);
                }
            }
        }
    } catch (error) {
        console.error('Error downloading files:', error);
    }
}

function clearFolder(folderPath) {
    if (fs.existsSync(folderPath)) {
        const files = fs.readdirSync(folderPath);
        for (const file of files) {
            const filePath = path.join(folderPath, file);
            fs.unlinkSync(filePath);
            console.log(`Removed old file: ${filePath}`);
        }
    }
}

module.exports = downloadFiles;
