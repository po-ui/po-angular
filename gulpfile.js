const { dest, parallel, series, src, task } = require('gulp');
const { replaceVersionPlaceholders } = require('./tools/version-replace');
const argv = require('yargs').argv;
const path = require('path');
const run = require('gulp-run');
const sonarqubeScanner = require('sonarqube-scanner');

/** Folders definitions */
const rootFolder = path.join(__dirname, './');
const distFolder = path.resolve(rootFolder, './dist');

const uiFolder = path.resolve(rootFolder, './projects/ui');
const uiSchematicsFolder = path.resolve(uiFolder, './schematics');
const distUiSchematicsFolder = path.resolve(rootFolder, './dist/ng-components/schematics');

const templatesFolder = path.resolve(rootFolder, './projects/templates');
const templatesSchematicsFolder = path.resolve(templatesFolder, './schematics');
const distTemplatesSchematicsFolder = path.resolve(rootFolder, './dist/ng-templates/schematics');

const syncFolder = path.resolve(rootFolder, './projects/sync');
const syncSchematicsFolder = path.resolve(syncFolder, './schematics');
const distSyncSchematicsFolder = path.resolve(rootFolder, './dist/ng-sync/schematics');

/** REPLACE VERSION: replace version of dist/package.json to repo version */
const replaceVersion = () =>
  src([`${rootFolder}/package.json`]).on('end', () => replaceVersionPlaceholders(distFolder));

/** SCHEMATICS */
const buildUiSchematics = () => run('npm run build:ui:schematics').exec();
const buildTemplatesSchematics = () => run('npm run build:templates:schematics').exec();
const buildSyncSchematics = () => run('npm run build:sync:schematics').exec();

/** UI SCHEMATICS */
const copyUiSchemas = () => src([`${uiSchematicsFolder}/**/*/schema.json`]).pipe(dest(distUiSchematicsFolder));
const copyUiFiles = () =>
  src([`${uiSchematicsFolder}/ng-generate/*/files/**`]).pipe(dest(`${distUiSchematicsFolder}/ng-generate`));
const copyUiCollection = () => src([`${uiSchematicsFolder}/collection.json`]).pipe(dest(distUiSchematicsFolder));
const copyUiMigrations = () => src([`${uiSchematicsFolder}/migrations.json`]).pipe(dest(distUiSchematicsFolder));

/** TEMPLATES SCHEMATICS */
const copyTemplatesSchemas = () =>
  src([`${templatesSchematicsFolder}/**/*/schema.json`]).pipe(dest(distTemplatesSchematicsFolder));
const copyTemplatesFiles = () =>
  src([`${templatesSchematicsFolder}/ng-generate/*/files/**`]).pipe(
    dest(`${distTemplatesSchematicsFolder}/ng-generate`)
  );
const copyTemplatesCollection = () =>
  src([`${templatesSchematicsFolder}/collection.json`]).pipe(dest(distTemplatesSchematicsFolder));

/** SYNC SCHEMATICS */
const copySyncMigrations = () => src([`${syncSchematicsFolder}/migrations.json`]).pipe(dest(distSyncSchematicsFolder));

/** SONAR */
const sonarqube = task('sonarqube', function (callback) {
  const token = argv.token || '';

  sonarqubeScanner(
    {
      serverUrl: 'http://sonarqube.po-ui.com.br',
      token: token,
      options: {
        // Documentation: https://docs.sonarqube.org/display/SONAR/Analysis+Parameters
        'sonar.projectKey': 'po-ui',
        'sonar.projectName': 'po-ui',
        'sonar.projectVersion': '1.0',
        'sonar.exclusions': `index.ts,.*`
      }
    },
    callback
  );
});

/** Exported Functions */
exports.sonarqube = sonarqube;
exports.replaceVersion = replaceVersion;

exports.templatesSchematics = series(
  buildTemplatesSchematics,
  parallel(copyTemplatesCollection, copyTemplatesFiles, copyTemplatesSchemas)
);

exports.uiSchematics = series(
  buildUiSchematics,
  parallel(copyUiCollection, copyUiMigrations, copyUiSchemas, copyUiFiles)
);

exports.syncSchematics = series(buildSyncSchematics, parallel(copySyncMigrations));
