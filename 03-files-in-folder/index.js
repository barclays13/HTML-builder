const fs = require('fs'),
  path = require('path'),
  { stdout } = require('process');

const pathFolder = path.join(`${__dirname}/secret-folder`);

fs.readdir(pathFolder, (err, files) => {
  if(err) throw err; 

  files.forEach( file => {
    const pathFile = `${pathFolder}\\${file}`;
    if (fs.lstatSync(pathFile).isFile()) {
      stdout.write(`${path.basename(pathFile, path.extname(pathFile))} - ${path.extname(pathFile).slice(1)} - ${fs.statSync(pathFile).size / 1024} kb\n`);
    } else if (fs.lstatSync(pathFile).isDirectory()) {
      fs.readdir(pathFile, (err, filesDir) => {
        if(err) throw err; 

        filesDir.forEach( fileDir => {
          const pathFileDir = `${pathFile}\\${fileDir}`;
          if (fs.lstatSync(pathFileDir).isFile()) {
            if (path.basename(pathFileDir) === '.gitkeep') {
              stdout.write(`${path.extname(pathFileDir)} - ${path.basename(pathFileDir, path.extname(pathFileDir)).slice(1)} - ${fs.statSync(pathFileDir).size / 1024} kb\n`);
            } else {
              stdout.write(`${path.basename(pathFileDir, path.extname(pathFileDir))} - ${path.extname(pathFileDir).slice(1)} - ${fs.statSync(pathFileDir).size / 1024} kb\n`);
            }
          }
        });
      });
    }
  });
});