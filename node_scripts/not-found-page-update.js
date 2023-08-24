const fs = require('fs');
  fs.copyFile('./build/404/index.html', './build/404/404.html', (err) => {
  fs.copyFile('./build/404/404.html', './build/404.html', (err) => {});
});