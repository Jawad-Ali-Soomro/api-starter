#!/usr/bin/env node

const { init } = require('../lib/init');

const command = process.argv[2];

if (command === 'init') {
    init();
} else if (!command) {
    console.log(`
Usage: npx express-file-based-routing@latest init

Commands:
  init    Initialize a new API starter project
    `);
} else {
    console.log(`Unknown command: ${command}`);
    console.log('Run "npx express-file-based-routing@latest" to see available commands.');
    process.exit(1);
}
