const fs = require('fs');
const path = require('path');

function removeWhiteSpaces(dir, files_) {
  files_ = files_ || [];
  let files = fs.readdirSync(dir);
  for (var i in files){
    let name = dir + '/' + files[i];
    if (fs.statSync(name).isDirectory()){
      removeWhiteSpaces(name, files_);
    } else {
      files_.push(name);
      if (path.extname(name) === ".pug") {
        let filePath = path.join(name);
        fs.readFile(filePath, "utf-8", (err, data) => {
          if (err) { throw err }
          let newData = data.split("\n");
          newData = newData.map(line => {
            if (/^\s*$/.test(line)) {
              return line;
            } else {
              return line.replace(/\.([\w-]+)\s+$/, ".$1");
            }
          });
          newData = newData.join("\n").replace(/[\r\n]+$/,'').replace(/img.+?,/g, match => match.replace('",', '"'));
          fs.writeFile(filePath, newData, err => {
            if (err) { throw err }
          });
        });
      }
    }
  }
  return files_;
}
removeWhiteSpaces('./src/views/')