const fs = require('fs'),
  path = require('path');

const pathProjectDir = path.join(__dirname, 'project-dist');
const pathStylesDir = path.join(__dirname, 'styles');

fs.readdir(pathStylesDir, (err, files) => {
  if (err) throw err;
  files.forEach( file => {
    if ( path.extname(file) == '.css' ) {
      const pathFile = path.join(pathStylesDir, file);
      const readData = fs.createReadStream(pathFile);
      readData.on('data', (data) => {
        fs.appendFile(path.join(pathProjectDir, 'bundle.css'), `${data} \n`, (err) => {
          if(err) throw err;
        });
      });
    }
  });
});

