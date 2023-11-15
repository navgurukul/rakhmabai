const axios = require('axios');
const fs = require('fs');
const path = require('path');

async function downloadFiles(response) {
    try {
        let offerLetters = response;
        // Define the destination folder for docx files
        const docxFolder = path.join(__dirname, 'docxeditor');

        // Check if the folder exists, if not, create it
        if (!fs.existsSync(docxFolder)) {
            fs.mkdirSync(docxFolder, { recursive: true });
        }

        // Clear the destination docx folder
        clearFolder(docxFolder);

        const downloadPromises = [];

        for (const offerLetter of offerLetters) {
            const attachments = offerLetter.attributes.attachment;
            for (const key in attachments) {
                if (attachments.hasOwnProperty(key)) {
                    const attachment = attachments[key];
                    const fileUrl = attachment.files.data.attributes.url;
                    const fileName = attachment.files.data.attributes.name;
                    const fileExtension = path.extname(fileName);

                    // Check if the file extension is .docx
                    if (fileExtension.toLowerCase() === '.docx') {
                        const filePath = path.join(docxFolder, fileName);
                        const downloadPromise = downloadFile(fileUrl, filePath);
                        downloadPromises.push(downloadPromise);
                    }
                }
            }
        }

        await Promise.all(downloadPromises);
        console.log('All files downloaded successfully.');
    } catch (error) {
        console.error('Error downloading files:', error);
    }
}

async function downloadFile(url, filePath) {
    const response = await axios({
        url: url,
        method: 'GET',
        responseType: 'stream',
    });

    const writer = fs.createWriteStream(filePath);

    return new Promise((resolve, reject) => {
        response.data.pipe(writer);
        writer.on('finish', resolve);
        writer.on('error', reject);
    });
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
