const { task } = require('gulp');
const sonarqubeScanner = require('sonarqube-scanner');
const argv = require('yargs').argv;

task('sonarqube', callback => {
  const token = argv.token || '';
  const url = argv.url || '';
  const projectKey = argv.projectKey || '';

  sonarqubeScanner(
    {
      serverUrl: url,
      token: token,
      options: {
        'sonar.projectKey': projectKey,
        'sonar.projectName': 'PO UI',
        'sonar.sources': 'projects',
        'sonar.exclusions':
          '**/node_modules/**,**/*.spec.ts,projects/app/**,projects/portal/**,**/samples/**,**/karma.conf.js,**/*-literals.ts,**/schematics/**',
        'sonar.typescript.lcov.reportPaths':
          'coverage/code-editor/lcov.info,coverage/storage/lcov.info,coverage/sync/lcov.info,coverage/templates/lcov.info,coverage/ui/lcov.info'
      }
    },
    callback
  );
});
