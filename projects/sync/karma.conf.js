// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage-istanbul-reporter'),
      require('@angular-devkit/build-angular/plugins/karma')
    ],
    client: {
      clearContext: false // leave Jasmine Spec Runner output visible in browser
    },
    coverageIstanbulReporter: {
      dir: require('path').join(__dirname, '../../coverage/sync'),
      reports: ['html', 'lcovonly', 'text-summary', 'cobertura'],
      fixWebpackSourcePaths: true,
      thresholds: {
        emitWarning: false, // set to 'true' to not fail the test command when thresholds are not met
        global: {
          statements: 95,
          branches: 95,
          functions: 95,
          lines: 95
        },
        each: {
          statements: 93,
          branches: 86,
          lines: 92,
          functions: 81
        }
      }
    },
    reporters: ['progress', 'kjhtml'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['ChromeHeadless'],
    customLaunchers: {
      ChromeHeadless: {
        base: 'Chrome',
        flags: ['--no-sandbox', '--headless', '--disable-gpu', '--remote-debugging-port=9222']
      }
    },
    singleRun: false,
    restartOnFileChange: true
  });
};
