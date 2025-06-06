const { dest, series, task, src } = require('gulp');
const fs = require('fs-extra');
const argv = require('yargs').argv;
const clean = require('gulp-clean');
const { exec } = require('child_process');

task('copy-resources:schematics', done => {
  const lib = argv.lib;
  const distLib = lib === 'ui' ? 'components' : lib;
  const copyFilter = p => /files(\/|\\)__path__/.test(p) || !/.+\.ts/.test(p) || /.template$/.test(p);

  fs.copySync(`./projects/${lib}/schematics`, `./dist/ng-${distLib}/schematics`, { filter: copyFilter });

  done();
});

task('tsc:schematics', done => {
  const lib = argv.lib;

  exec(`npm run tsc -- -p ./projects/${lib}/tsconfig.schematics.json`, (err, stdout, stderr) => {
    if (err) {
      console.error(`exec error: ${err}`);
      return done(err);
    }
    console.log(stdout);
    console.log(stderr);
    done();
  });
});

task('tsc:schematics:lib', done => {
  exec(`npm run tsc -- -p ./projects/schematics/tsconfig.json`, (err, stdout, stderr) => {
    if (err) {
      console.error(`exec error: ${err}`);
      return done(err);
    }
    console.log(stdout);
    console.error(stderr);
    done();
  });
});

task('copy-resources:schematics:lib', () => {
  return src([`./projects/schematics/package.json`, `./projects/schematics/README.md`]).pipe(
    dest('./dist/ng-schematics')
  );
});

task('clean:schematics:lib', () => {
  return src('./dist/ng-schematics', { read: false, allowEmpty: true }).pipe(clean());
});

/**
 * build schematics of library informed by lib argument
 *
 * ex: gulp build:schematics --lib ui
 */
task('build:schematics', series('tsc:schematics', 'copy-resources:schematics'));

/** build ./project/schematics */
task('build:schematics:lib', series('clean:schematics:lib', 'tsc:schematics:lib', 'copy-resources:schematics:lib'));
