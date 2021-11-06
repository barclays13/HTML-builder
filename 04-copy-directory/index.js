const fs = require('fs'),
  path = require('path');

const pathFilesDir = path.join(__dirname, 'files');
const pathFilesCopyDir = path.join(__dirname, 'files-copy');

fs.mkdir(pathFilesCopyDir, { recursive: true }, err => {
  if(err) throw err;
});

fs.readdir(pathFilesDir, (err, files) => { 
  if(err) throw err; 
  files.forEach( file => {
    fs.copyFile(`${pathFilesDir}\\${file}`, `${pathFilesCopyDir}\\${file}`, err => {
      if(err) throw err; 
    });
  });
});

fs.readdir(pathFilesCopyDir, (err, files) => { 
  if(err) throw err; 
  files.forEach( file => {
    fs.access(`${pathFilesDir}\\${file}`, err => {
      if(err) {
        fs.unlink(`${pathFilesCopyDir}\\${file}`,  err => {
          if(err) throw err; 
        });
      }
    });
  });
});



