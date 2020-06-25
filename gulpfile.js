const { dest, parallel, series, src, task } = require('gulp');
const { replaceVersionPlaceholders } = require('./tools/version-replace');
const argv = require('yargs').argv;
const path = require('path');
const run = require('gulp-run');
const sonarqubeScanner = require('sonarqube-scanner');

/** Folders definitions */
const rootFolder = path.join(__dirname, './');
const distFolder = path.resolve(rootFolder, './dist');

const schematicsFolder = path.resolve(rootFolder, './projects/schematics');
const distSchematicsFolder = path.resolve(rootFolder, './dist/ng-schematics');

const uiSchematicsFolder = path.resolve(rootFolder, './projects/ui/schematics');
const distUiSchematicsFolder = path.resolve(rootFolder, './dist/ng-components/schematics');

const templatesSchematicsFolder = path.resolve(rootFolder, './projects/templates/schematics');
const distTemplatesSchematicsFolder = path.resolve(rootFolder, './dist/ng-templates/schematics');

const syncSchematicsFolder = path.resolve(rootFolder, './projects/sync/schematics');
const distSyncSchematicsFolder = path.resolve(rootFolder, './dist/ng-sync/schematics');

const storageSchematicsFolder = path.resolve(rootFolder, './projects/storage/schematics');
const distStorageSchematicsFolder = path.resolve(rootFolder, './dist/ng-storage/schematics');

/** REPLACE VERSION: replace version of dist/package.json to repo version */
const replaceVersion = () =>
  src([`${rootFolder}/package.json`]).on('end', () => replaceVersionPlaceholders(distFolder));

/** SCHEMATICS */
const buildUiSchematics = () => run('npm run build:ui:schematics').exec();
const buildTemplatesSchematics = () => run('npm run build:templates:schematics').exec();
const buildSyncSchematics = () => run('npm run build:sync:schematics').exec();
const buildStorageSchematics = () => run('npm run build:storage:schematics').exec();

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

/** STORAGE SCHEMATICS */
const copyStorageSchemas = () =>
  src([`${storageSchematicsFolder}/**/*/schema.json`]).pipe(dest(distStorageSchematicsFolder));
const copyStorageCollection = () =>
  src([`${storageSchematicsFolder}/collection.json`]).pipe(dest(distStorageSchematicsFolder));

/** SCHEMATICS */
const copySchematicsPackage = () => src([`${schematicsFolder}/package.json`]).pipe(dest(distSchematicsFolder));
const copySchematicsReadme = () => src([`${schematicsFolder}/README.md`]).pipe(dest(distSchematicsFolder));

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

exports.storageSchematics = series(buildStorageSchematics, parallel(copyStorageCollection, copyStorageSchemas));

exports.copyFilesSchematics = series(copySchematicsPackage, copySchematicsReadme);
