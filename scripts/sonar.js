const { task } = require('gulp');
const scanner = require('sonarqube-scanner').default;
const argv = require('yargs').argv;

const validateArgument = (value, name) => {
  if (!value) {
    throw new Error(`O argumento --${name} é obrigatório.`);
  }
  return value;
};

task('sonarqube', callback => {
  try {
    const token = validateArgument(argv.token, 'token');
    const url = validateArgument(argv.url, 'url');
    const projectKey = validateArgument(argv.projectKey, 'projectKey');

    const exclusions = [
      '**/node_modules/**',
      '**/*.spec.ts',
      'projects/app/**',
      'projects/portal/**',
      '**/samples/**',
      '**/karma.conf.js',
      '**/*-literals.ts',
      '**/schematics/**'
    ].join(',');

    const lcovReportPaths = [
      'coverage/code-editor/lcov.info',
      'coverage/storage/lcov.info',
      'coverage/sync/lcov.info',
      'coverage/templates/lcov.info',
      'coverage/ui/lcov.info'
    ].join(',');

    scanner(
      {
        serverUrl: url,
        token: token,
        options: {
          'sonar.projectKey': projectKey,
          'sonar.login': token,
          'sonar.projectName': projectKey,
          'sonar.sources': 'projects',
          'sonar.exclusions': exclusions,
          'sonar.typescript.lcov.reportPaths': lcovReportPaths
        }
      },
      callback
    );
  } catch (error) {
    console.error(error.message);
    callback(error);
  }
});
