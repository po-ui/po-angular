#!/usr/bin/env node
require('shelljs/global');

const program = require('commander');
const command = require('../src');
const package = require('../package.json');

program.version(package.version);

program.on('--help', () => {
  // Print PORTINARI
  console.log('  ____   ___  ____ _____ ___ _   _    _    ____  ___  ');
  console.log(' |  _ \\ / _ \\|  _ \\_   _|_ _| \\ | |  / \\  |  _ \\|_ _| ');
  console.log(' | |_) | | | | |_) || |  | ||  \\| | / _ \\ | |_) || |  ');
  console.log(' |  __/| |_| |  _ < | |  | || |\\  |/ ___ \\|  _ < | |  ');
  console.log(' |_|    \\___/|_| \\_\\|_| |___|_| \\_/_/   \\_\\_| \\_\\___| ');
});

program
  .command('new <themeName>')
  .alias('n')
  .description('Create a new theme for Portinari UI')
  .action(themeName => command.new(themeName));

program
  .command('build')
  .alias('b')
  .description('Build package for new theme')
  .option("--fonts", "to copy custom fonts")
  .option("--name", "name of file generated on build")
  .action(options => command.build(options));

program.parse(process.argv);
