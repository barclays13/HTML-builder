const fs = require('fs'),
  path = require('path'),
  { stdout, stdin } = require('process');

const pathText = path.join(`${__dirname}/text.txt`);
const writeableStream = fs.createWriteStream(pathText);

stdout.write('Hello everyone, enter your message...\n');
stdin.on('data', data => {
  if (data.toString() == 'exit\r\n') process.exit();
  writeableStream.write(data);
});

process.on('SIGINT', () => process.exit());
process.on('exit', () => stdout.write('Bye!'));
