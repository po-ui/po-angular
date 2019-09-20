const { dest, parallel, series, src, watch } = require('gulp');

const argv = require('yargs').argv;
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const del = require('del');
const version = require('./package.json').version;

const concat = require('gulp-concat');
const minify = require('gulp-minify');
const postcss = require('gulp-postcss');
const rename = require('gulp-rename');
const tap = require('gulp-tap');

const apply = require('postcss-apply');
const customProperties = require('postcss-custom-properties')
const importCss = require('postcss-import');
const nested = require('postcss-nested');

const distDirectory = 'style';

const capitalize = string =>
  string.split('-')
    .map(part => part.charAt(0).toUpperCase() + part.substring(1).toLowerCase())
    .join(' ');

/**
 * ============================================================
 * TAREFAS PARA A GERAÇÃO DOS PACKAGES DOS TEMAS
 * ============================================================
 */
const cleanTemp = () => del('./.temp');
const cleanThemeDir = () => del('./dist');

const copyThemeAssets = () =>
  src('./src/assets/**/*.*').pipe(dest(`./dist/${distDirectory}${argv.theme ? '-' + argv.theme : ''}/`));

const copyThemePackageJson = () =>
  src('package.json')
    .pipe(tap(file => {
      const contents = JSON.parse(file.contents.toString());

      delete contents.devDependencies;
      delete contents.scripts;

      contents.name = `@portinari/style${argv.theme ? '-' + argv.theme : ''}`;
      contents.description = `Portinari - Theme${argv.theme ? ' ' + capitalize(argv.theme) : ''}`;

      file.contents = Buffer.from(JSON.stringify(contents, null, 2), 'utf-8');
    }))
    .pipe(dest(`./dist/${distDirectory}${argv.theme ? '-' + argv.theme : ''}/`));

const copyThemeVariablesCss = () =>
  src(`./src/css/themes/po-theme-default.css`)
    .pipe(rename(`po-theme-default-variables.css`))
    .on('error', err => {
      console.log(err.toString());
      this.emit('end');
    })
    .pipe(dest(`./dist/${distDirectory}${argv.theme ? '-' + argv.theme : ''}/css/`));

const prepareThemeCss = () => src('./src/**/*.css').pipe(dest('./.temp'));

const buildThemeCss = modern =>
  src(`./.temp/css/index${modern ? '-modern' : ''}.css`)
    .pipe(tap(file => {
      const contents = file.contents.toString().replace(/\${theme}/, (argv.theme || 'default'));

      file.contents = Buffer.from(contents, 'utf-8');
    }))
    .pipe(postcss([
      importCss(),
      apply(),
      nested(),
      customProperties({
        preserve: false,
        warnings: true
      }),
      autoprefixer(),
      cssnano()
    ]))
    .pipe(rename(modern ? `css/po-theme-core.min.css` : `css/po-theme-default.min.css`))
    .on('error', err => {
      console.log(err.toString());
      this.emit('end');
    })
    .pipe(dest(`./dist/${distDirectory}${argv.theme ? '-' + argv.theme : ''}/`));

const buildThemeVariablesCss = () =>
  src(`./.temp/css/themes/po-theme-${argv.theme ? argv.theme : 'default'}.css`)
    .pipe(postcss([ cssnano() ]))
    .pipe(rename(`po-theme-${argv.theme ? argv.theme : 'default'}-variables.min.css`))
    .on('error', err => {
      console.log(err.toString());
      this.emit('end');
    })
    .pipe(dest(`./dist/${distDirectory}${argv.theme ? '-' + argv.theme : ''}/css/`));

// Tarefa otimizada para desenvolvimento
const buildDevThemeCss = () =>
  src('./.temp/css/index.css')
    .pipe(tap(file => {
      const contents = file.contents.toString().replace(/\${theme}/, (argv.theme || 'default'));

      file.contents = Buffer.from(contents, 'utf-8');
    }))
    .pipe(postcss([
      importCss(),
      apply(),
      nested()
    ]))
    .pipe(rename(`css/po-theme-default.min.css`))
    .on('error', err => {
      console.log(err.toString());
      this.emit('end');
    })
    .pipe(dest(`./dist/${distDirectory}${argv.theme ? '-' + argv.theme : ''}/`));

const buildThemeCssModern = () => buildThemeCss(true);
const buildThemeCssLegacy = () => buildThemeCss(false);

const buildTheme = series(
  cleanTemp,
  parallel(copyThemeAssets, copyThemePackageJson, copyThemeVariablesCss, prepareThemeCss),
  parallel(buildThemeCssModern, buildThemeVariablesCss, buildThemeCssLegacy),
  cleanTemp
);
buildTheme.displayName = 'build';

/**
 * ============================================================
 * TAREFAS PARA A GERAÇÃO DO APP DE TESTES DOS TEMAS
 * ============================================================
 */
const cleanAppDir = () => del('./app-dist');

const copyApp = () => src('./src/app/*.*').pipe(dest('./app-dist'));
const copyAppAssets = () => src('./src/app/assets/**/*.*').pipe(dest('./app-dist/assets'));

const copyAppComponents = () => src(['./src/css/**/*.html', './src/css/**/*.js']).pipe(dest('./app-dist/css'));

const copyThemeToApp = () =>
  src([`./dist/${distDirectory}${argv.theme ? '-' + argv.theme : ''}/**/*.*`, '!./dist/*.json'])
    .pipe(dest('./app-dist/assets/'));

const buildAppJs = () =>
  src(['./src/app/js/*.js', '!./src/app/js/po-chart.js'])
    .pipe(concat('app.js'))
    .pipe(minify({
      ext: {
        min: '.min.js'
      },
      noSource: true
    }))
    .pipe(tap(file => {
      file.contents = Buffer.from(`var version = '${version}';` + file.contents.toString(), 'utf-8');
    }))
    .pipe(dest('./app-dist/js'));

const buildApp = series(
  cleanAppDir,
  parallel(copyApp, copyAppAssets, copyAppComponents, buildAppJs),
  buildTheme,
  copyThemeToApp
);
buildApp.displayName = 'build:app';

/**
 * ============================================================
 * TAREFAS GENÉRICAS
 * ============================================================
 */
const clean = parallel(cleanThemeDir, cleanAppDir, cleanTemp);

const configThemeName = () => (argv.theme || 'default').substring(0, 29).padEnd(30);

const watchers = () => {
  console.warn('\n');
  console.warn('   ╔═════════════════════════════════════════════════╗');
  console.warn('   ║                                                 ║');
  console.warn('   ║   NÃO ESQUEÇA DE INICIAR O SEU SERVIDOR HTTP!   ║');
  console.warn('   ║                                                 ║');
  console.warn('   ║   Execute em outro terminal (http-server):      ║');
  console.warn('   ║   - npm run dev                                 ║');
  console.warn('   ║                                                 ║');
  console.warn('   ║   Ou use o servidor que você achar melhor:      ║');
  console.warn('   ║   - live-server                                 ║');
  console.warn('   ║   - tanto faz ...                               ║');
  console.warn('   ║                                                 ║');
  console.warn('   ║   Ao atualizar um arquivo CSS ou HTML a sua     ║');
  console.warn('   ║   aplicação será carregada automaticamente!     ║');
  console.warn('   ║                                                 ║');
  console.warn('   ║   TEMA UTILIZADO: ' + configThemeName()      + '║');
  console.warn('   ║                                                 ║');
  console.warn('   ╚═════════════════════════════════════════════════╝');

  watch('./src/**/*.html', copyAppComponents);
  watch('./src/**/*.css', series(prepareThemeCss, buildDevThemeCss, copyThemeToApp));
}

/**
 * ============================================================
 * EXPORT DAS TAREFAS DO GULP
 * ============================================================
 */
// gulp clean
exports.clean = clean;

// gulp build
exports.build = series(clean, buildTheme);

// gulp build:app
exports.buildApp = buildApp;

// gulp
exports.default = series(clean, buildApp);

// gulp watch
exports.watch = series(clean, buildApp, watchers);
