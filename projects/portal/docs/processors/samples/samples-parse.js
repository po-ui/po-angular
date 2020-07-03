const _ = require('lodash'),
  path = require('canonical-path'),
  EXAMPLE_REGEX = /<example([^>]*)>([\S\s]+?)<\/example>/g,
  ATTRIBUTE_REGEX = /\s*([^=]+)\s*=\s*(?:(?:"([^"]+)")|(?:'([^']+)'))/g,
  FILE_REGEX = /<file([^>]*)>([\S\s]+?)<\/file>/g;

/**
 * @dgProcessor parseExamplesProcessor
 * @description
 * Search the documentation for examples that need to be extracted
 */
module.exports = function parseExamplesProcessor(log, exampleMap, trimIndentation, createDocMessage) {
  let hasParentFolder;
  return {
    $runAfter: ['files-read'],
    $runBefore: ['parsing-tags'],
    $process: function (docs) {
      docs.forEach(function (doc) {
        try {
          if (!doc.content) {
            return;
          }

          doc.content = doc.content.replace(EXAMPLE_REGEX, function processExample(match, attributeText, exampleText) {
            hasParentFolder = false;

            var example = extractAttributes(attributeText);
            var id = uniqueName(exampleMap, 'sample-' + (example.name || 'sample'));
            _.assign(example, {
              attributes: _.omit(example, ['files', 'doc']),
              files: extractFiles(exampleText),
              id: id,
              doc: doc,
              deployments: {}
            });

            exampleMap.set(id, example);

            return `{@runnableExample [${id},${hasParentFolder}]}`;
          });
        } catch (error) {
          throw new Error(createDocMessage('Failed to parse examples', doc, error));
        }
      });
    }
  };

  function extractAttributes(attributeText) {
    var attributes = {};
    attributeText.replace(ATTRIBUTE_REGEX, function (match, prop, val1, val2) {
      attributes[prop] = val1 || val2;
    });
    return attributes;
  }

  function extractFiles(exampleText) {
    var files = {};
    exampleText.replace(FILE_REGEX, function (match, attributesText, contents) {
      var file = extractAttributes(attributesText);
      if (!file.name) {
        throw new Error('Missing name attribute in file: ' + match);
      }

      // Extract the contents of the file
      file.fileContents = trimIndentation(contents);
      file.language = path.extname(file.name).substr(1);
      file.type = file.type || file.language || 'file';
      file.attributes = _.omit(file, ['fileContents']);

      // Store this file information
      files[file.name] = file;

      if (file.name && !hasParentFolder && file.name.split('/').length > 1) {
        hasParentFolder = true;
      }
    });
    return files;
  }

  function uniqueName(containerMap, name) {
    if (containerMap.has(name)) {
      var index = 1;
      while (containerMap.has(name + index)) {
        index += 1;
      }
      name = name + index;
    }
    return name;
  }
};
