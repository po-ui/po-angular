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
      dir: require('path').join(__dirname, '../../coverage/templates'),
      reports: ['html', 'lcovonly', 'text-summary', 'cobertura'],
      fixWebpackSourcePaths: true,
      thresholds: {
        emitWarning: false, // set to 'true' to not fail the test command when thresholds are not met
        global: {
          statements: 96,
          branches: 91,
          functions: 92,
          lines: 96
        },
        each: {
          statements: 80,
          branches: 80,
          lines: 80,
          functions: 80,
          overrides: {
            'src/lib/components/po-page-blocked-user/po-page-blocked-user-reason/po-page-blocked-user-reason.component.ts': {
              statements: 48,
              lines: 44,
              branches: 0,
              functions: 14
            },
            'src/lib/components/po-page-blocked-user/po-page-blocked-user-contacts/po-page-blocked-user-contacts.component.ts': {
              statements: 48,
              lines: 46,
              branches: 0,
              functions: 16
            },
            'src/lib/components/po-page-dynamic-detail/po-page-dynamic.service.ts': {
              statements: 58,
              lines: 58,
              branches: 8,
              functions: 36
            },
            'src/lib/components/po-page-dynamic-edit/po-page-dynamic.service.ts': {
              statements: 55,
              lines: 54,
              branches: 8,
              functions: 27
            },
            'src/lib/components/po-page-dynamic-table/po-page-dynamic.service.ts': {
              statements: 55,
              lines: 54,
              branches: 8,
              functions: 27
            }
          }
        }
      }
    },
    reporters: ['progress', 'kjhtml'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['ChromeHeadless', 'Chrome'],
    customLaunchers: {
      ChromeHeadless: {
        base: 'Chrome',
        flags: ['--no-sandbox', '--headless', '--disable-gpu', '--remote-debugging-port=9222']
      }
    },
    singleRun: false,
    restartOnFileChange: true,
    browserNoActivityTimeout: 30000
  });
};
