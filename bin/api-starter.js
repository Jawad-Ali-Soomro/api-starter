#!/usr/bin/env node

const { init } = require('../lib/init');

const command = process.argv[2];

if (command === 'init') {
    init();
} else if (!command) {
    console.log(`
Usage: npx api-starter@latest <command>

Commands:
  init    Initialize a new API starter project
    `);
} else {
    console.log(`Unknown command: ${command}`);
    console.log('Run "npx api-starter@latest" to see available commands.');
    process.exit(1);
}
