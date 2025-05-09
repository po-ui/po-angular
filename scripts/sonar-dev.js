require('dotenv').config();

const { exec } = require('child_process');
const { task } = require('gulp');
const scanner = require('sonarqube-scanner').default;

const validateArgument = (value, name) => {
  if (!value) {
    throw new Error(`O argumento --${name} é obrigatório.`);
  }
  return value;
};

const getBranchName = () =>
  new Promise((resolve, reject) => {
    return exec('git rev-parse --abbrev-ref HEAD', (err, stdout, stderr) => {
      if (err) reject(`getBranch Error: ${err}`);
      else if (typeof stdout === 'string') resolve(stdout.trim());
    });
  });

task('sonarqube-dev', async callback => {
  try {
    const token = validateArgument(process.env.TOKEN_SONAR, 'TOKEN_SONAR');
    const url = validateArgument(process.env.URL_SONAR, 'URL_SONAR');
    const projectKey = 'POUI';
    const branch = validateArgument(await getBranchName(), 'BRANCH_NAME');

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
          'sonar.token': token,
          'sonar.projectName': projectKey,
          'sonar.sources': 'projects',
          'sonar.exclusions': exclusions,
          'sonar.typescript.lcov.reportPaths': lcovReportPaths,
          'sonar.branch.name': branch
        }
      },
      callback
    );
  } catch (error) {
    console.error(error.message);
    callback(error);
  }
});
