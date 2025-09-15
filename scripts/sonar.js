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
    const branchName = validateArgument(argv.branchName, 'branchName');

    let conditionalOptions = {};

    if (argv.pullRequestId) {
      const pullRequestId = validateArgument(argv.pullRequestId, 'pullRequestId');
      const pullRequestBase = validateArgument(argv.pullRequestBase, 'pullRequestBase');

      conditionalOptions = {
        'sonar.pullrequest.key': pullRequestId,
        'sonar.pullrequest.base': pullRequestBase,
        'sonar.pullrequest.branch': branchName
      };
    } else {
      conditionalOptions = {
        'sonar.branch.name': branchName
      };
    }

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
        token,
        options: {
          'sonar.projectKey': projectKey,
          'sonar.token': token,
          'sonar.projectName': projectKey,
          'sonar.sources': 'projects',
          'sonar.exclusions': exclusions,
          'sonar.typescript.lcov.reportPaths': lcovReportPaths,
          'sonar.sourceEncoding': 'UTF-8',
          ...conditionalOptions
        }
      },
      callback
    );
  } catch (error) {
    console.error(error.message);
    callback(error);
  }
});
