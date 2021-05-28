// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage'),
      require('@angular-devkit/build-angular/plugins/karma')
    ],
    client: {
      clearContext: false // leave Jasmine Spec Runner output visible in browser
    },
    coverageReporter: {
      dir: require('path').join(__dirname, '../../coverage/templates'),
      subdir: '.',
      watermarks: {
        statements: [50, 75],
        functions: [50, 75],
        branches: [50, 75],
        lines: [50, 75]
      },
      reporters: [{ type: 'html' }, { type: 'lcovonly' }, { type: 'text-summary' }, { type: 'cobertura' }],
      check: {
        global: {
          statements: 99,
          branches: 99,
          functions: 99,
          lines: 99
        },
        each: {
          branches: 99,
          statements: 99,
          lines: 99,
          functions: 99
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
        flags: ['--no-sandbox', '--headless', '--disable-gpu', '--disable-web-security', '--remote-debugging-port=9222']
      }
    },
    singleRun: false,
    restartOnFileChange: true,
    browserNoActivityTimeout: 30000
  });
};
