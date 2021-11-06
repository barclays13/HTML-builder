const fs = require('fs'),
  path = require('path'),
  { stdout } = require('process');

const pathFolder = path.join(`${__dirname}/secret-folder`);


fs.readdir(pathFolder, { withFileTypes: true }, (err, files) => {
  if(err) throw err; 

  files.forEach( file => {
    const pathFile = `${pathFolder}\\${file.name}`;

    if (file.isFile()) {
      fs.stat(pathFile, (err, stats) => {
        if (err) throw err;
        stdout.write(`${file.name.split('.')[0]} - ${path.extname(file.name).slice(1)} - ${+stats.size / 1000}kb \n`);
      });
    } else if (file.isDirectory()) {
      fs.readdir(pathFile, { withFileTypes: true }, (err, files) => {
      
        if (err) throw err;
        files.forEach( file => {
          
          if (file.isFile()) {
            fs.stat(pathFile, (err, stats) => {
              if (err) throw err;
              stdout.write(` ${path.extname(file.name)} - ${file.name.slice(1)} - ${+stats.size / 1000}kb \n`);
            });
          }
        });
      });
    }
  });
});