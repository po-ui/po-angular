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

    // Novos parâmetros para Pull Request
    // const pullRequestKey = argv.pullrequestKey || process.env.GITHUB_EVENT_PULL_REQUEST_NUMBER;
    const pullRequestBranch = argv.pullrequestBranch || process.env.GITHUB_HEAD_REF;
    const pullRequestBase = argv.pullrequestBase || process.env.GITHUB_BASE_REF;

    console.log('pullRequestBranch', pullRequestBranch);
    console.log('pullRequestBase', pullRequestBase);

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

    const sonarOptions = {
      'sonar.projectKey': projectKey,
      'sonar.login': token,
      'sonar.projectName': projectKey,
      'sonar.sources': 'projects',
      'sonar.exclusions': exclusions,
      'sonar.typescript.lcov.reportPaths': lcovReportPaths,
      'sonar.scm.exclusions.disabled': 'true',
      'sonar.pullrequest.analyzeAllFiles': 'true'
    };

    // Adiciona os parâmetros de Pull Request se for uma análise de PR
    if (pullRequestBranch && pullRequestBase) {
      // sonarOptions['sonar.pullrequest.key'] = pullRequestKey;
      sonarOptions['sonar.pullrequest.branch'] = pullRequestBranch;
      sonarOptions['sonar.pullrequest.base'] = pullRequestBase;
    }

    console.log('SONAR:', sonarOptions);

    scanner(
      {
        serverUrl: url,
        token: token,
        options: sonarOptions
      },
      callback
    );
  } catch (error) {
    console.error(error.message);
    callback(error);
  }
});
