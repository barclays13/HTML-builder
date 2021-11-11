const fs = require('fs'),
  path = require('path');



fs.mkdir(path.join(__dirname, 'project-dist'), { recursive: true }, (err) => {
  if (err) throw err;
});

const pathStylesDir = path.join(__dirname, 'styles'),
  pathProject = path.join(__dirname, 'project-dist'),
  pathComponents = path.join(__dirname, 'components'),
  pathIndex = path.join(pathProject, 'index.html'),
  pathFilesDir = path.join(__dirname, 'assets'),
  pathFilesCopyDir = path.join(pathProject, 'assets'),
  pathProjectDir = path.join(__dirname, 'project-dist');

//html
const baseHtml = fs.createReadStream(path.join(__dirname, 'template.html')),
  newHtml = fs.createWriteStream(pathIndex);
baseHtml.pipe(newHtml);

fs.readFile(pathIndex, 'utf-8',( err , data ) => {
  
  if (err) throw err;

  fs.readdir(pathComponents, ( err, components ) => {
    if (err) throw err;
    components.reverse().forEach( item => {
      fs.readFile(path.join(pathComponents, item), 'utf-8',( err, dataItem ) => {
        if (err) throw err;
        const name = item.split('.').slice(0, -1).join('.');
        data = data.replace(`{{${name}}}`, dataItem);
        fs.writeFile(pathIndex, data, 'utf-8', err => {
          if (err) throw err;
        });
      });
    });

  });

  // fs.readFile(path.join(pathComponents, 'header.html'), 'utf-8', ( err, dataHeader ) => {
  //   if (err) throw err;
  //   data = data.replace('{{header}}', dataHeader);
  //   fs.writeFile(pathIndex, data, 'utf-8', err => {
  //     if (err) throw err;
  //   });
  // });
  // fs.readFile(path.join(pathComponents, 'articles.html'), 'utf-8', ( err, dataArticle ) => {
  //   if (err) throw err;
  //   data = data.replace('{{articles}}', dataArticle);
  //   fs.writeFile(pathIndex, data, 'utf-8', err => {
  //     if (err) throw err;
  //   });
  // });
  // fs.readFile(path.join(pathComponents, 'footer.html'), 'utf-8', ( err, dataFooter ) => {
  //   if (err) throw err;
  //   data = data.replace('{{footer}}', dataFooter);
  //   fs.writeFile(pathIndex, data, 'utf-8', err => {
  //     if (err) throw err;
  //   });
  // });

  // fs.readFile(path.join(pathComponents, 'about.html'), 'utf-8', ( err, dataFooter ) => {
  //   if (err) throw err;
  //   data = data.replace('{{about}}', dataFooter);
  //   fs.writeFile(pathIndex, data, 'utf-8', err => {
  //     if (err) throw err;
  //   });
  // });
});

// copy assets
fs.mkdir(pathFilesCopyDir, { recursive: true }, err => {
  if(err) throw err;
});

fs.readdir(pathFilesDir, { withFileTypes: true }, (err, files) => { 
  if(err) throw err; 
  files.forEach( file => {
    if (file.isFile()) {
      fs.copyFile(path.join(pathFilesDir, file.name), path.join(pathFilesCopyDir, file.name), err => {
        if(err) throw err; 
      });
    } else if (file.isDirectory()) {
      const pathSubFolder = path.join(pathFilesDir, file.name),
        pathSubFolderCopy = path.join(pathFilesCopyDir, file.name);
      
      fs.mkdir(pathSubFolderCopy, { recursive: true }, err => {
        if(err) throw err;
      });
      
      fs.readdir(path.join(pathFilesDir, file.name), ( err, filesDir ) => {
        if(err) throw err; 
        filesDir.forEach( fileDir => {
          fs.copyFile(path.join(pathSubFolder, fileDir), path.join(pathSubFolderCopy, fileDir), err => {
            if(err) throw err; 
          });
        });
      });
    }
  });
});

fs.readdir(pathFilesCopyDir, { withFileTypes: true }, (err, files) => { 
  if(err) throw err; 
  files.forEach( file => {
    if(file.isFile()) {
      fs.access(path.join(pathFilesDir, file), err => {
        if(err) {
          fs.unlink(path.join(pathFilesCopyDir, file),  err => {
            if(err) throw err; 
          });
        }
      });
    } else if ( file.isDirectory() ) {
      const pathSubFolder = path.join(pathFilesDir, file.name),
        pathSubFolderCopy = path.join(pathFilesCopyDir, file.name);

      fs.readdir(pathSubFolderCopy, ( err, fileCheck ) => {
        if(err) throw err;  
        fileCheck.forEach( item => {
          fs.access(path.join(pathSubFolder, item), err => {
            if(err) {
              fs.unlink(path.join(pathSubFolderCopy, item),  err => {
                if(err) throw err; 
              });
            }
          });
        });
      });
    }
  });
});

// css bundle
fs.readdir(pathStylesDir, (err, files) => {
  if (err) throw err;
  files.forEach( file => {
    if ( path.extname(file) == '.css' ) {
      const pathFile = path.join(pathStylesDir, file);
      const readData = fs.createReadStream(pathFile);
      readData.on('data', (data) => {
        fs.appendFile(path.join(pathProjectDir, 'style.css'), `${data} \n`, (err) => {
          if(err) throw err;
        });
      });
    }
  });
});