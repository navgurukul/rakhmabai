

// npm install googleapis@39 --save
const readline = require("readline");
const { google } = require("googleapis");

var fs = require("fs");

function upload( filePath, fileName) {

// If modifying these scopes, delete token.json.
const SCOPES = ["https://www.googleapis.com/auth/drive"];

const TOKEN_PATH = "token.json";

// Load client secrets from a local file.
try{

    var content = fs.readFileSync("credentials.json");
}
catch(err){
    console.error(err)

}
const credentials = JSON.parse(content)
const { client_secret, client_id, redirect_uris } = credentials.web;
var oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
  );

  // Check if we have previously stored a token.
  try{
      var token = fs.readFileSync(TOKEN_PATH)

  }catch(err){
    console.log("error")
    // const authUrl = oAuth2Client.generateAuthUrl({
    //     access_type: "offline",
    //     scope: SCOPES,
    //     });
    //     console.log("Authorize this app by visiting this url:", authUrl);
    //     const rl = readline.createInterface({
    //     input: process.stdin,
    //     output: process.stdout,
    //     });
    //     rl.question("Enter the code from that page here: ", (code) => {
    //     rl.close();
    //     oAuth2Client.getToken(code, (err, token) => {
    //         if (err) return console.error("Error retrieving access token", err);
    //         oAuth2Client.setCredentials(token);
    //         // Store the token to disk for later program executions
    //         fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
    //         if (err) return console.error(err);
    //         console.log("Token stored to", TOKEN_PATH);
    //         });
    //     });
    //     });
  }
  oAuth2Client.setCredentials(JSON.parse(token));
  console.log(oAuth2Client)

  const drive = google.drive({ version: "v3", auth:oAuth2Client });
  // id of google drive folder in which pdf need to be uploaded
  var folderId = "1yqq3EgnUrwnGkot2WSttsfIjcjf6fZpH";

  var fileMetadata = {
    name: fileName,
    parents: [folderId],
  };
  var media = {
    mimeType: "application/pdf",
    body: fs.createReadStream(filePath),
  };
  console.log("till now")
  drive.files.create(
    {
      resource: fileMetadata,
      media: media,
      fields: "id,name",
    },
    function (err, file) {
      if (err) {
        // Handle error
        console.error(err);
      } else {
        console.log("File Id: ", file.data);
        // update donor status to `issued` in sheet
        return file.data.id
      }
    }
  );
}
module.exports = {upload}