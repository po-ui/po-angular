const { task, src } = require('gulp');
const { platform } = require('os');
const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const buildVersion = require('../package.json').version;
const versionPlaceholderText = '0.0.0-PLACEHOLDER';
const versionPlaceholderRegex = new RegExp(versionPlaceholderText, 'g');

/** replace version of dist/<package>/package.json and other files to repository version */
task('replaceVersion', () => {
  const rootFolder = path.join(__dirname, '../');
  const distFolder = path.resolve(rootFolder, './dist');

  return src([`${rootFolder}/package.json`]).on('end', () => replaceVersionPlaceholders(distFolder));
});

/**
 * Altera todos os arquivos do diretorio informado como paramentro, que contenham 0.0.0-PLACEHOLDER e 0.0.0-NG
 * para a versão do package.json raiz do projeto.
 */
function replaceVersionPlaceholders(packageDir) {
  // Busca todos os arquivos que contenham placeholders de versão, usando findstr e grep.
  const files = findFilesWithPlaceholders(packageDir);

  // Percorre todos os arquivos que contem placeholders de versão e substitui eles com a versão do package.json da pasta root.
  files.forEach(filePath => {
    const fileContent = fs.readFileSync(filePath, 'utf-8').replace(versionPlaceholderRegex, buildVersion);

    fs.writeFileSync(filePath, fileContent);
  });
}

/** Localiza todos os arquivos no diretório do pacote especificado. */
function findFilesWithPlaceholders(packageDir) {
  const findCommand = buildPlaceholderFindCommand(packageDir);
  return spawnSync(findCommand.binary, findCommand.args)
    .stdout.toString()
    .split(/[\n\r]/)
    .filter(String);
}

/** Compila o comando que será executado para encontrar todos os arquivos que contenham 0.0.0-PLACEHOLDER E 0.0.0-NG. */
function buildPlaceholderFindCommand(packageDir) {
  if (platform() === 'win32') {
    return {
      binary: 'findstr',
      args: ['/msi', `${versionPlaceholderText}`, `${packageDir}\\*`]
    };
  } else {
    return {
      binary: 'grep',
      args: ['-ril', `${versionPlaceholderText}`, packageDir]
    };
  }
}
