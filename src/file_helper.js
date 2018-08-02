const path = require('path');
const fs = require('fs');

exports.writeData = (data, fileName) => {
  const filePath = path.join(__dirname, fileName);

  fs.writeFile(filePath, data, 'utf8', (err) => {
    if (err) throw err;
  });
};
