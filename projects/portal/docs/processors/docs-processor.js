/**
 * Processor to add properties to docs objects.
 *
 * isMethod     | Whether the doc is for a method on a class.
 * isDirective  | Whether the doc is for a @Component or a @Directive
 * isService    | Whether the doc is for an @Injectable
 * isNgModule   | Whether the doc is for an NgModule
 * isInterface  | Whether the doc is for an Interface
 * isModel      | Whether the doc is for a Model
 */
const path = require('path'),
  fs = require('fs'),
  functions = require('./helpers/functions'),
  colors = require('colors');

module.exports = function categorizer() {
  return {
    $runBefore: ['docs-processed'],
    $process: function (docs) {
      docs
        .filter(
          doc =>
            (doc.docType === 'class' || doc.docType == 'interface' || doc.docType == 'enum') &&
            doc.docsPrivate == null &&
            (doc.description || doc.docsExtends)
        )
        .forEach(function (doc) {
          processClassDoc(docs, doc);
        });
    }
  };

  /**
   * processs all class docs inside of the dgeni pipeline.
   * - Methods and properties of a class-doc will be extracted into separate variables.
   * - Identifies directives, services, interfaces or NgModules and marks them them in class-doc.
   */
  function processClassDoc(allDocs, classDoc) {
    functions.processClassBasics(classDoc, allDocs);
    functions.processPublicDoc(classDoc);

    // Categorize the current visited classDoc into its Angular type.
    if (functions.isDirective(classDoc)) {
      classDoc.isDirective = true;
      classDoc.directiveExportAs = functions.getMetadataProperty(classDoc, 'exportAs');
      classDoc.directiveSelectors = functions.getDirectiveSelectors(classDoc);
    } else if (functions.isService(classDoc)) {
      classDoc.isService = true;
    } else if (functions.isNgModule(classDoc)) {
      classDoc.isNgModule = true;
    } else if (functions.isInterface(classDoc)) {
      classDoc.isInterface = true;
    } else if (functions.isEnum(classDoc)) {
      classDoc.isEnum = true;
    } else if (functions.isModel(classDoc)) {
      classDoc.isModel = true;
    }
  }
};
