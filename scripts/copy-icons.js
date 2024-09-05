const fs = require('fs');
const path = require('path');

const targetIcon = `${__dirname}/../projects/portal/src/assets/json/`;

// Lista dos arquivos que devem ser manipulados
const files = [
  {
    path: `${__dirname}/../node_modules/@animaliads/animalia-icon/src/fill/selection.json`,
    name: `icons-fill.json`
  },
  {
    path: `${__dirname}/../node_modules/@animaliads/animalia-icon/src/regular/selection.json`,
    name: `icons-regular.json`
  }
];

// Função para copiar os arquivos
const copyFile = (source, target) => {
  let sourcePath = path.resolve(source);
  let targetPath = path.resolve(target);
  fs.copyFileSync(sourcePath, targetPath);
  console.log(`Copied ${source} to ${target}`);
};

//#region Copia dos jsons
if (!fs.existsSync(targetIcon)) {
  fs.mkdirSync(targetIcon);
}

files.forEach(e => {
  copyFile(e.path, `${targetIcon}/${e.name}`);
});
//#endregion
