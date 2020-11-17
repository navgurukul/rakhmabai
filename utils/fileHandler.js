var fs = require("fs");

async function readFile(path) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, "utf8", function (err, data) {
      if (err) {
        reject(err);
      }
      resolve(data);
    });
  });
}

async function writeFile(fileName, data) {
  fs.writeFile(fileName, data, function (err) {
    if (err) return console.log(err);
  });
}
module.exports = {
  readFile,
  writeFile,
};
