const axios = require('axios');
const fs = require('fs');
const path = require('path');

async function downloadFiles(response) {
    try {
        // const response = await axios.get('https://merd-strapi.merakilearn.org/api/offer-letters?populate=cc,attachment.files');
        
        let offerLetters = response
        // offerLetters = offerLetters.filter((item) => item.attributes.campusName == 'Dantewada');
        // console.log(offerLetters, '>>>>>>>>>>>>')
        for (const offerLetter of offerLetters) {
            const attachments = offerLetter.attributes.attachment;
            // console.log(attachments,'>>>>>>>>>>>>')
            for (const key in attachments) {
                if (attachments.hasOwnProperty(key)) {
                    const attachment = attachments[key];
                    console.log(attachment, '>>>>>>>>>>>>')
                    const fileUrl = attachment.files.data.attributes.url;
                    console.log(fileUrl, '>>>>>>>')
                    const fileName = attachment.files.data.attributes.name;
                    const fileExtension = path.extname(fileName);
                    const destinationFolder = fileExtension === '.pdf' ? 'pdfeditor' : 'docxeditor';
                    const folderPath = path.join(__dirname, destinationFolder);

                    // Create the destination folder if it doesn't exist
                    if (!fs.existsSync(folderPath)) {
                        fs.mkdirSync(folderPath, { recursive: true });
                    }

                    const filePath = path.join(folderPath, fileName);

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

module.exports = downloadFiles;
