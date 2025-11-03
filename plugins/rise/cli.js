#!/usr/bin/env node

const { execSync } = require('child_process');

const args = process.argv.slice(2);

if (args.length === 0) {
  console.log('Использование: rise <команда>');
  process.exit(0);
}

const command = `yarn ${args.join(' ')}`;

try {
  execSync(command, { stdio: 'inherit' });
} catch (err) {
  console.error(err.message);
  process.exit(0);
}