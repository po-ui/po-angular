const { dest, parallel, series, src } = require('gulp');

const argv = require('yargs').argv;
const chalk = require('chalk');
const cssnano = require('cssnano');
const del = require('del');

const postcss = require('gulp-postcss');
const rename = require('gulp-rename');

const customProperties = require('postcss-custom-properties')
const importCss = require('postcss-import');

async function command() {
  console.log('\n ' + chalk.white.bold('Build custom theme ...'));

  const customFonts = argv.fonts;
  const customName = argv.name || 'custom';

  const cleanDirTemp = () => del('./.temp');
  const cleanDirDist = () => del('./dist');

  const copyAssets = (assetType, custom = false) =>
    src(`${custom ? './src/assets/' : './node_modules/@portinari/style/'}${assetType}/**/*.*`)
      .pipe(dest(`./dist/${assetType}/`));

  const copyPackageJson = () => src('package.json').pipe(dest(`./dist/`));

  const copyCssToDirTemp = () => src('./src/**/*.css').pipe(dest('./.temp/css/'));

  const buildThemeVariablesCss = () =>
    src(`./.temp/css/po-theme-custom.css`)
      .pipe(postcss([ cssnano() ]))
      .pipe(rename(`po-theme-${customName}-variables.min.css`))
      .on('error', err => {
        console.log(err.toString());
        this.emit('end');
      })
      .pipe(dest(`./dist/css/`));

  const buildThemeCssLegacy = () =>
    src('./.temp/css/index.css')
      .pipe(postcss([
        importCss(),
        customProperties({
          preserve: false,
          warnings: true
        }),
        cssnano()
      ]))
      .pipe(rename(`css/po-theme-${customName}.min.css`))
      .on('error', err => {
        console.log(err.toString());
        this.emit('end');
      })
      .pipe(dest(`./dist/`));

  const copyAssetsImages = () => copyAssets('images');
  const copyAssetsIcons = () => copyAssets('icons');
  const copyAssetsFonts = () => copyAssets('fonts', customFonts);

  const showFinalMessage = () => {
    console.log('\n========================\n')
    console.log(' ' + chalk.white.bold('To publish theme:') + '\n');
    console.log(' ' + chalk.green.bold(`cd dist`));
    console.log(' ' + chalk.green.bold(`npm publish`) + '\n');
  };

  (series(
    parallel(cleanDirDist, cleanDirTemp),
    parallel(copyAssetsImages, copyAssetsIcons, copyAssetsFonts, copyPackageJson, copyCssToDirTemp),
    parallel(buildThemeVariablesCss, buildThemeCssLegacy),
    parallel(cleanDirTemp, showFinalMessage)
  ))();
}

module.exports = command;
