const newCmd = require('./new');
const buildCommand = require('./build');

class Commands {
  constructor(newCommand, buildCommand) {
    this.new = newCommand;
    this.build = buildCommand;
  }
}

module.exports = new Commands(newCmd, buildCommand);