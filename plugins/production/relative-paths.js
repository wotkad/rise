const fs = require('fs');
const path = require('path');

class RelativeAssetsPlugin {
  constructor(options = {}) {
    this.baseDir = options.baseDir || 'build';
    this.targetDir = options.targetDir || '/assets';
  }

  apply(compiler) {
    compiler.hooks.done.tap('RelativeAssetsPlugin', () => {
      this.processFiles(this.baseDir, 1);
    });
  }

  processFiles(dir, level) {
    const files = fs.readdirSync(dir);
    const levels = { 1: '.', 2: '..', 3: '../..', 4: '../../..' };
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      if (stat.isDirectory()) {
        this.processFiles(filePath, level + 1);
      } else if (/\.(html|css)$/i.test(file)) {
        let content = fs.readFileSync(filePath, 'utf8');
        const replaced = content.replace(
          new RegExp(this.targetDir, 'g'),
          `${levels[level]}${this.targetDir}`
        );
        if (replaced !== content) {
          fs.writeFileSync(filePath, replaced, 'utf8');
        }
      }
    }
  }
}

module.exports = RelativeAssetsPlugin;
