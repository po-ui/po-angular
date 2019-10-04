#!/usr/bin/env node
require('shelljs/global');

const program = require('commander');
const command = require('../src');
const figlet = require('figlet');
const package = require('../package.json');

program.version(package.version);

program.on('--help');

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
  .action(options => command.build(options));

program.parse(process.argv);
