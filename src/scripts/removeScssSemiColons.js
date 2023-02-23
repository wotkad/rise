const fs = require('fs');
const path = require('path');

function removeSemiColons(dir, files_) {
  files_ = files_ || [];
  let files = fs.readdirSync(dir);
  for (var i in files){
    let name = dir + '/' + files[i];
    if (fs.statSync(name).isDirectory()){
      removeSemiColons(name, files_);
    } else {
      files_.push(name);
      if (path.extname(name) === '.scss') {
        let filePath = path.join(name);
        fs.readFile(filePath, 'utf-8', (err, content) => {
          if (err) { throw err }
          const updatedContent = content.replace(/@apply.*;/g, match => match.replace(';', ''));
          fs.writeFile(filePath, updatedContent, 'utf-8', err => {
            if (err) { throw err }
          });
        });
      }
    }
  }
  return files_;
}
removeSemiColons('./src/assets/styles/')