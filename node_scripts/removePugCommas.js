const fs = require('fs');
const path = require('path');

function removeUnnecessaryCommas(dir, files_) {
  files_ = files_ || [];
  let files = fs.readdirSync(dir);
  for (var i in files){
    let name = dir + '/' + files[i];
    if (fs.statSync(name).isDirectory()){
      removeUnnecessaryCommas(name, files_);
    } else {
      files_.push(name);
      if (path.extname(name) === '.pug') {
        let filePath = path.join(name);
        fs.readFile(filePath, 'utf-8', (err, content) => {
          if (err) { throw err }
          const updatedContent = content.replace(/img.+?,/g, match => match.replace('",', '"'));
          fs.writeFile(filePath, updatedContent, 'utf-8', err => {
            if (err) { throw err }
          });
        });
      }
    }
  }
  return files_;
}
removeUnnecessaryCommas('./src/views/')