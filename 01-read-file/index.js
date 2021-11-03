const fs = require('fs');
const path = require('path');

const pathText = path.join(`${__dirname}/text.txt`);
const readData = fs.createReadStream(pathText);
readData.on('data', (data) => console.log(data.toString()));
