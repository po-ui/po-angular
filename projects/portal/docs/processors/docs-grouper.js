/**
 * Processor to group docs into top-level "Components" WRT material design, e.g., "Button", "Tabs",
 * where each group may conists of several directives and services.
 */
const path = require('path');
const grouper = require('./helpers/grouper');
const fileWriter = require('./helpers/file-writer');

var filesInfo = [];

module.exports = function componentGrouper() {
  return {
    $runBefore: ['docs-processed'],
    $process: function (docs) {
      // Map of group name to group instance.
      let groups = new Map();

      docs
        .filter(
          doc =>
            (doc.docType === 'class' || doc.docType == 'interface' || doc.docType == 'enum') &&
            doc.docsPrivate == null &&
            (doc.description || doc.docsExtends)
        )
        .forEach(doc => {
          // Full path to the file for this doc.
          let basePath = doc.fileInfo.basePath,
            filePath = doc.fileInfo.filePath;
          // All of the component documentation is under `src/lib`, which will be the basePath.
          // We group the docs up by the directory immediately under `src/lib` (e.g., "button").
          let groupNamePath = path.relative(basePath, filePath).split(path.sep),
            groupName = groupNamePath
              .slice(-1)
              .pop()
              .match(/^(.+?)\.?(component|service|directive|interceptor|model)?(\.(ts))?$/)[1],
            groupType = groupNamePath[0];

          // Get the group for this doc, or, if one does not exist, create it.
          let group;

          if (groups.has(groupName)) {
            group = groups.get(groupName);
            group.types.indexOf(groupType) === -1 ? group.types.push(groupType) : group.types;
          } else {
            const capitalizedNameArray = grouper.resolveCapitalizedComponentName(doc.moduleDoc);
            group = new grouper.ComponentGroup(groupName);
            group.types.push(groupType);
            group.ngModule = grouper.resolveModuleDoc(groupNamePath, docs);
            group.fileInfo = doc.fileInfo;
            group.description = doc.description;
            group.fileType = groupNamePath[3]; // components | services ...
            group.componentName = capitalizedNameArray.join('');
            group.title = capitalizedNameArray.join(' ');

            groups.set(groupName, group);
          }
          // Put this doc into the appropriate list in this group.
          if (doc.isDirective) {
            group.directives.push(doc);
          } else if (doc.isService) {
            group.services.push(doc);
          } else if (doc.isModel) {
            group.models.push(doc);
          } else if (doc.docType == 'class') {
            group.additionalClasses.push(doc);
          } else if (doc.isInterface && doc.usedBy) {
            grouper.resolveInterfaceDocs(doc, docs, groups);
          } else if (doc.isEnum && doc.usedBy) {
            grouper.resolveEnumDocs(doc, docs, groups);
          }

          //Seta package
          const packageName = group.fileInfo.projectRelativePath.substring(0, group.fileInfo.projectRelativePath.indexOf('/'));
          group.package = packageName === 'ui' ? 'components' : packageName;

          //Se o grupo não for módulo, interface ou base
          if (
            !groupName.includes('module') &&
            !groupName.includes('interface') &&
            !groupName.includes('enum') &&
            !groupName.includes('base')
          ) {
            fileWriter.generateApiComponentFile(groupName, group.componentName);

            fileWriter.generateSamplesArray(doc, group);

            var existsFile = filesInfo.some(file => file.name == groupName);

            if (!existsFile) {
              filesInfo.push({
                name: groupName,
                types: group.types,
                type: group.fileType,
                title: group.title,
                module: groupName,
                path: group.fileInfo.filePath.split(group.types[0]).pop(),
                preview: group.description
              });
            }

          }
        });

      const arrayGroups = Array.from(groups.values(groups.values()));

      const filteredGroups = arrayGroups.filter(group => {
        return (
          !group.name.includes('module') &&
          !group.name.includes('interface') &&
          !group.name.includes('base') &&
          !group.name.includes('enum')
        );
      });

      // Gera um arquivo json com dados da lista de componentes
      fileWriter.generateDocsJsonFile(JSON.stringify(filesInfo));

      // Gera arquivos .ts para módulo e rotas dos exemplos
      fileWriter.generateDocumentationRoutingModule(filteredGroups);

      return filteredGroups;
    }
  };
};
