const path = require('path'),
  Dgeni = require('dgeni'),
  DgeniPackage = Dgeni.Package;

// dgeni packages
const jsdocPackage = require('dgeni-packages/jsdoc'),
  nunjucksPackage = require('dgeni-packages/nunjucks'),
  typescriptPackage = require('dgeni-packages/typescript'),
  examplePackage = require('dgeni-packages/examples');

const configuration = require('./configuration'),
  util = require('./util'),
  portalFolder = path.resolve(__dirname.replace(/\\/g, '/'), '../');
projectsRootFolder = path.resolve(__dirname, '../../');

const isEnvironmentPath = configuration.sourceFolder !== './../';

let fileNames = [];

const fileWriter = require('./processors/helpers/file-writer');
const versionPath = 'src/assets/json/version.json';
const data = `{ "version": "${configuration.version}" }\n`;

fileWriter.writeFile(versionPath, data, error => {
  error ? console.error('write error:  ' + error.message) : console.log('Successful Write to ' + versionPath);
});

const poFolders = 'components|directives|services|interceptors|models|interfaces';
const poFileTypes = 'component|module|interface|service|enum|interceptor|directive|model';
const poPackages = 'ui|templates|storage|sync|code-editor';

const stringExpression = `\.\.\/(${poPackages})\/src/lib\/(${poFolders})\/(.*)(${poFileTypes})\.ts$`,
  regularExpression = new RegExp(stringExpression);

fileNames = util.readFilesFromRepo(regularExpression);

let poDocsPackage = new DgeniPackage('po-api-docs', [
  jsdocPackage,
  nunjucksPackage,
  typescriptPackage,
  examplePackage
])

  // Processor that appends categorization flags to the docs, e.g. `isDirective`, `isNgModule`, etc.
  .processor(require('./processors/docs-processor'))
  // Processor to group components into top-level groups such as "Tabs", "Sidenav", etc.
  .processor(require('./processors/docs-grouper'))
  // Processor to generate samples
  .processor(require('./processors/samples/samples-parse'))
  .processor(require('./processors/samples/samples-generate'))

  .config(function (log) {
    log.level = 'info';
  })

  // Configure the processor for reading files from the file system.
  .config(function (readFilesProcessor, writeFilesProcessor) {
    readFilesProcessor.basePath = /*isEnvironmentPath ? configuration.sourceFolder :*/ path.resolve(projectsRootFolder);
    readFilesProcessor.$enabled = false; // disable for now as we are using readTypeScriptModules
    writeFilesProcessor.outputFolder = path.resolve(portalFolder, configuration.outputFolder);
  })

  // Configure the output path for written files (i.e., file names).
  .config(function (computePathsProcessor) {
    computePathsProcessor.pathTemplates = [
      {
        docTypes: ['componentGroup', 'interface', 'enum', 'class'],
        pathTemplate: '${name}',
        outputPathTemplate: 'sample-${name}/doc/sample-${name}-doc.component.html'
      }
    ];
  })

  // Configure custom JsDoc tags.
  .config(function (parseTagsProcessor) {
    parseTagsProcessor.tagDefinitions = parseTagsProcessor.tagDefinitions.concat(configuration.customTags);
  })

  // Configure processor for finding nunjucks templates.
  .config(function (readTypeScriptModules) {
    readTypeScriptModules.basePath = /*isEnvironmentPath ? configuration.sourceFolder : */ path.resolve(
      projectsRootFolder
    );
    readTypeScriptModules.ignoreExportsMatching = [/^_/];
    readTypeScriptModules.hidePrivateMembers = true;

    // Entry points for docs generation. All publically exported symbols found through these
    // files will have docs generated.
    const fileTypesOrder = ['.interface', '.enum'];
    const classify = fileName => fileTypesOrder.findIndex(type => fileName.includes(type));
    readTypeScriptModules.sourceFiles = fileNames.sort((a, b) => classify(a) - classify(b));
  })
  .config(function (templateFinder, templateEngine) {
    // Where to find the templates for the doc rendering
    templateFinder.templateFolders = [
      path.resolve(__dirname, configuration.templateApiFolder),
      path.resolve(__dirname, configuration.templateSampleFolder)
    ];

    // Standard patterns for matching docs to templates
    templateFinder.templatePatterns = [
      '${ doc.template }',
      '${ doc.id }.${ doc.docType }.template.html',
      '${ doc.id }.template.html',
      '${ doc.docType }.template.html',
      '${ doc.id }.${ doc.docType }.template.js',
      '${ doc.id }.template.js',
      '${ doc.docType }.template.js',
      '${ doc.id }.${ doc.docType }.template.json',
      '${ doc.id }.template.json',
      '${ doc.docType }.template.json'
    ];

    // Nunjucks and Angular conflict in their template bindings so change Nunjucks
    templateEngine.config.tags = {
      variableStart: '{$',
      variableEnd: '$}'
    };
  })

  //Example path configuration
  .config(function (computePathsProcessor, computeIdsProcessor) {
    computePathsProcessor.pathTemplates.push({
      docTypes: ['example'],
      pathTemplate: '${example.id}',
      outputPathTemplate: './sample-${example.docName}/samples/${example.id}-view.component.html'
    });
    computePathsProcessor.pathTemplates.push({
      docTypes: ['example-file'],
      getPath: function () {},
      outputPathTemplate: './sample-${id}'
    });
    computePathsProcessor.pathTemplates.push({
      docTypes: ['runnableExample'],
      pathTemplate: '${example.id}',
      getOutputPath: function () {}
    });
    computeIdsProcessor.idTemplates.push({
      docTypes: ['example', 'example-file', 'runnableExample'],
      getAliases: function (doc) {
        return [doc.id];
      }
    });
  })
  .config(function (generateExamplesProcessor, generateProtractorTestsProcessor) {
    var deployments = [
      {
        name: 'default',
        examples: {}
      }
    ];
    generateExamplesProcessor.deployments = deployments;
    generateProtractorTestsProcessor.deployments = deployments;
  });

module.exports = poDocsPackage;
