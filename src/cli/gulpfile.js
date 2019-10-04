const { dest, parallel, series, src } = require('gulp');

const cssnano = require('cssnano');
const del = require('del');

const postcss = require('gulp-postcss');
const rename = require('gulp-rename');

const customProperties = require('postcss-custom-properties')
const importCss = require('postcss-import');

/**
 * ============================================================
 * TAREFAS PARA A GERAÇÃO DOS PACKAGES DOS TEMAS
 * ============================================================
 */
const cleanDirTemp = () => del('./.temp');
const cleanDirDist = () => del('./dist');

const copyAssets = assetType =>
  src(`./node_modules/@portinari/style/${assetType}/**/*.*`)
    .pipe(dest(`./dist/${assetType}/`));

const copyPackageJson = () =>
  src('package.json')
    .pipe(dest(`./dist/`));

const copyCssToDirTemp = () => src('./src/**/*.css').pipe(dest('./.temp/css/'));

const buildThemeVariablesCss = () =>
  src(`./.temp/css/po-theme.css`)
    .pipe(postcss([ cssnano() ]))
    .pipe(rename(`po-theme-variables.min.css`))
    .on('error', err => {
      console.log(err.toString());
      this.emit('end');
    })
    .pipe(dest(`./dist/css/`));

const buildThemeCss = modern =>
  src('./.temp/css/index.css')
    .pipe(postcss([
      importCss(),
      customProperties({
        preserve: false,
        warnings: true
      }),
      cssnano()
    ]))
    .pipe(rename(`css/po-theme-custom.min.css`))
    .on('error', err => {
      console.log(err.toString());
      this.emit('end');
    })
    .pipe(dest(`./dist/`));

const copyAssetsImages = () => copyAssets('images');
const copyAssetsFonts = () => copyAssets('fonts');

const buildThemeCssLegacy = () => buildThemeCss(false);

const build = series(
  parallel(cleanDirDist, cleanDirTemp),
  parallel(copyAssetsImages, copyAssetsFonts, copyPackageJson, copyCssToDirTemp),
  parallel(buildThemeVariablesCss, buildThemeCssLegacy),
  cleanDirTemp
);

/**
 * ============================================================
 * EXPORT DAS TAREFAS DO GULP
 * ============================================================
 */
exports.build = build;

exports.default = series(build);
