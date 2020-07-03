const _ = require('lodash'),
  path = require('canonical-path'),
  fs = require('fs'),
  colors = require('colors');

const configuration = require('./../../configuration');
const isEnvironmentPath = configuration.sourceFolder !== './../';
const projectRootFolder = path.join(__dirname, `${configuration.sourceFolder}../`);

/**
 * @dgProcessor generateExamplesProcessor
 * @description
 * Create doc objects of the various things that need to be rendered for an example.
 * This includes the files that will be run in an iframe, the code that will be injected *
 */
module.exports = function generateExamplesProcessor(log, exampleMap) {
  return {
    $runAfter: ['adding-extra-docs'],
    $runBefore: ['extra-docs-added'],
    $validate: {
      deployments: {
        presence: true
      }
    },
    $process: function (docs) {
      var that = this;

      exampleMap.forEach(function (example) {
        var stylesheets = [];
        var scripts = [];
        var tests = [];
        var files = [];

        // The index file is special, see createExampleDoc()
        example.indexFile = example.files['index.html'];

        const filterFilesE2e = file => file.includes('.po.ts') || file.includes('.e2e-spec.ts');
        const haveE2e = Object.keys(example.files).filter(filterFilesE2e).length >= 2;

        // if (!haveE2e) {
        //   console.warn(`warn`.yellow + ':   ', `O exemplo: ${example.name} não possui teste e2e`);
        // }

        // Create a new document for each file of the example
        _.forEach(example.files, function (file, fileName) {
          if (fileName === 'index.html') return;

          //Gets sample path
          var samplePath = example.doc.fileInfo.relativePath.replace(/\\/g, '/').split('/');

          //Defines if is ui || templates || code-editor
          example.project = samplePath[0];
          //Defines the sample doc
          example.docName = samplePath.pop().match(/^(.+?)\.?(component|service|directive|interceptor)?(\.(ts))?$/)[1];

          samplePath = samplePath.join('/') + '/samples/' + fileName;

          var fileDoc = that.createFileDoc(example, file);

          //Read sample file contents
          try {
            fileDoc.fileContents = fs.readFileSync(
              `${projectRootFolder}${samplePath}`,
              'utf-8'
            );

            // Inject base url inside protractor page objects
            if (fileName.includes('.po.ts')) {
              const url = configuration.protractorWebBaseUrl.replace('{component}', example.docName);
              fileDoc.fileContents = fileDoc.fileContents.replace('browser.baseUrl', url);
            }
          } catch (error) {
            console.warn(`warn`.yellow + ':   ', `O arquivo: ${samplePath} não existe`);
          }

          docs.push(fileDoc);

          // Store a reference to the fileDoc for attaching to the exampleDocs
          if (file.type == 'css') {
            stylesheets.push(fileDoc);
          } else if (file.type == 'ts') {
            if (file.name.includes('.po.ts') | file.name.includes('.e2e-spec.ts')) {
              tests.push(fileDoc);
            } else {
              scripts.push(fileDoc);
            }
          } else if (file.type == 'html') {
            files.push(fileDoc);
          }
        });

        // Create an index.html document for the example (one for each deployment type)
        _.forEach(that.deployments, function (deployment) {
          var exampleDoc = that.createExampleDoc(example, deployment, stylesheets, scripts, tests, files);
          docs.push(exampleDoc);
          example.deployments[deployment.name] = exampleDoc;
        });
      });
    },

    createExampleDoc: function (example, deployment, stylesheets, scripts, tests, files) {
      var deploymentQualifier = deployment.name === 'default' ? '' : '-' + deployment.name,
        commonFiles = (deployment.examples && deployment.examples.commonFiles) || {},
        dependencyPath = (deployment.examples && deployment.examples.dependencyPath) || '.';

      var exampleDoc = {
        id: example.id,
        title: example.title,
        project: example.project,
        deployment: deployment,
        deploymentQualifier: deploymentQualifier,
        docType: 'example',
        fileInfo: example.doc.fileInfo,
        startingLine: example.doc.startingLine,
        endingLine: example.doc.endingLine,
        example: example,
        template: 'index.template.html',
        doc: example.doc,
        docName: example.docName
      };

      // Copy in the common scripts and stylesheets
      exampleDoc.scripts = _.map(commonFiles.scripts, function (script) {
        return {
          path: script
        };
      });
      exampleDoc.stylesheets = _.map(commonFiles.stylesheets || [], function (stylesheet) {
        return {
          path: stylesheet
        };
      });
      exampleDoc.files = _.map(commonFiles.files || [], function (file) {
        return {
          path: file
        };
      });
      exampleDoc.tests = _.map(commonFiles.tests || [], function (file) {
        return {
          path: file
        };
      });

      // Copy in any dependencies for this example
      if (example.deps) {
        _.forEach(example.deps.split(';'), function (dependency) {
          var filePath = /(https?:)?\/\//.test(dependency)
            ? dependency
            : /(https?:)?\/\//.test(dependencyPath)
            ? dependencyPath + dependency
            : path.join(dependencyPath, dependency);
          if (filePath.match(/\.ts$/)) {
            if (filePath.includes('.po.ts') || filePath.includes('.e2e-spec.ts')) {
              exampleDoc.tests.push({
                path: filePath
              });
            } else {
              exampleDoc.scripts.push({
                path: filePath
              });
            }
          } else if (filePath.match(/\.css$/)) {
            exampleDoc.stylesheets.push({
              path: filePath
            });
          } else if (filePath.match(/\.html$/)) {
            exampleDoc.files.push({
              path: filePath
            });
          }
        });
      }

      // Attach the specific scripts and stylesheets for this example
      exampleDoc.stylesheets = exampleDoc.stylesheets.concat(stylesheets);
      exampleDoc.scripts = exampleDoc.scripts.concat(scripts);
      exampleDoc.tests = exampleDoc.files.concat(tests);
      exampleDoc.files = exampleDoc.files.concat(files);

      // If there is content specified for the index.html file then use its contents for this doc
      if (example.files[0] && example.indexFile) {
        exampleDoc.fileContents = example.files[0].fileContents;
      }
      return exampleDoc;
    },

    createFileDoc: function (example, file) {
      var fileDoc = {
        docType: 'example-file',
        id: `${example.docName}/samples/${file.name}`,
        title: example.title,
        fileInfo: example.doc.fileInfo,
        startingLine: example.doc.startingLine,
        endingLine: example.doc.endingLine,
        example: example,
        template: 'template.' + file.type,
        fileContents: file.fileContents,
        path: file.name,
        doc: example.doc,
        docName: example.docName
      };

      return fileDoc;
    },

    createManifestDoc: function (example) {
      var files = _(example.files)
        .omit('index.html')
        .map(function (file) {
          return file.name;
        })
        .value();
    }
  };
};
