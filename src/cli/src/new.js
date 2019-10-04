const chalk = require('chalk');
const del = require('del');
const fs = require('fs');
const inquirer = require('inquirer');
const path = require('path');
const spawn = require('cross-spawn');

const overwritePrompt = projectName => ({
  type: 'confirm',
  name: 'overwrite',
  message: `There is already a project called "${projectName}", do you want to overwrite it?`
});

const getPath = projectName => path.join(process.cwd(), projectName);

async function command(themeName) {
  const destination = getPath(themeName);

  if (fs.existsSync(destination)) {
    const { overwrite } = await inquirer.prompt([overwritePrompt(themeName)]);

    if (!overwrite) {
      return;
    }

    await del(destination, { force: true });
  }

  try {
    console.log(chalk.white.bold('Initializing new theme...'));

    fs.mkdirSync(destination + '/src/assets/fonts', { recursive: true });

    fs.copyFileSync(
      __dirname.replace('src', 'node_modules/@portinari/style/css/po-theme-default-variables.css'),
      destination + '/src/po-theme-custom.css');

    const package = {
      name: themeName,
      version: '1.0.0',
      author: '',
      description: `Custom Theme - ${themeName}`,
      repository: {},
      license: 'MIT',
      scripts: {
        build: 'po-theme build'
      },
      devDependencies: {
        '@portinari/style': '1.10.0-alpha.2'
      }
    };

    fs.writeFileSync(destination + '/package.json', JSON.stringify(package, {}, 2));

    fs.writeFileSync(destination + '/src/index.css', 
      '@import \'../../node_modules/@portinari/style/css/po-theme-core.min.css\';' + '\r\n\r\n' +
      '@import \'./po-theme-custom.css\';'
    );

    cd(destination);

    await _installPackages();

    console.log('\n========================\n')
    console.log(' ' + chalk.white.bold('To custom theme:') + '\n');
    console.log(' ' + chalk.green.bold(`cd ${themeName}`));
    console.log(' ' + chalk.green.bold(`Customize your theme in 'src/po-theme-custom.css'`));
    console.log(' ' + chalk.green.bold(`Build: 'npm run build'`));

  } catch (e) {
    console.error(`Ops! An error occurred in the installation of the project "${themeName}"`);
    console.error(e.message);
  }
}

function _installPackages() {
  console.log(chalk.white.bold('Installing packages...') + '\n');

  return new Promise((resolve, reject) => {
    let command = 'npm';
    let args = ['install'];

    const child = spawn(command, args, { stdio: 'inherit' });
    child.on('close', code => {
      if (code !== 0) {
        reject({ command: `${command} ${args.join(' ')}` });
        return;
      }

      console.log(chalk.white.bold('Packages installed sucessfully!'));
      resolve();
    })
  })
}

module.exports = command;