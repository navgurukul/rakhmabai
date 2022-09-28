const csv = require("csv-parser");
const fs = require('fs')
const certificate = require('./certificateGeneration')

const results = [];


fs.createReadStream('../Certificates - Metamorphosis Workshops - Sheet4.csv')
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', async() => {
        console.log(results);
        for (const i of results) {
            
            await certificate.olGenerator(i);
            console.log(i)
            // break 
        }
        // [
        //   { NAME: 'Daffy Duck', AGE: '24' },
        //   { NAME: 'Bugs Bunny', AGE: '22' }
        // ]
    });
    