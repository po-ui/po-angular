/**
 * Processor to group docs into top-level "Components" WRT material design, e.g., "Button", "Tabs",
 * where each group may conists of several directives and services.
 */
const path = require('path');
const grouper = require('./helpers/grouper');
const fileWriter = require('./helpers/file-writer');
const { assignGroupAnchors } = require('./helpers/anchors');
const { resolveDocsMenu } = require('./helpers/docs-menu');
const docsCategories = require('../docs-categories');

const MENU_TAGS = ['docsCategory', 'docsParent', 'docsShortcut', 'docsOrder'];

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

            if (isPureDirective(doc)) {
              group.fileType = 'directives';
            }

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

          collectMenuTags(doc, group, groupName);

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

            const samples = fileWriter.generateSamplesArray(doc, group);

            var existsFile = filesInfo.some(file => file.name == groupName);

            if (!existsFile) {
              filesInfo.push({
                name: groupName,
                types: group.types,
                type: group.fileType,
                title: group.title,
                module: groupName,
                path: group.fileInfo.filePath.split(group.types[0]).pop(),
                preview: group.description,
                hasSamples: samples.length > 0
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

      // `id` estável (âncora) de cada classe, propriedade, método, interface e enum; usado no HTML e no índice de busca.
      filteredGroups.forEach(assignGroupAnchors);

      // Categorias do menu e da listagem (tags @docsCategory/@docsParent/@docsShortcut/@docsOrder)
      applyMenuCategories(filesInfo, groups);

      // Gera um arquivo json com dados da lista de componentes
      fileWriter.generateDocsJsonFile(JSON.stringify(filesInfo));

      // Gera arquivos .ts para módulo e rotas dos exemplos
      fileWriter.generateDocumentationRoutingModule(filteredGroups);

      return filteredGroups;
    }
  };
};

function isListedGroup(groupName) {
  return !['module', 'interface', 'enum', 'base'].some(part => groupName.includes(part));
}

/** Guarda no grupo as tags de menu do doc (a primeira de cada tag vale; atalhos somam). */
function collectMenuTags(doc, group, groupName) {
  const tagged = MENU_TAGS.filter(tag => doc[tag] !== undefined && doc[tag] !== null);

  if (!tagged.length) return;

  if (!isListedGroup(groupName) || doc.isInterface || doc.isEnum) {
    console.warn(`[docs-menu] aviso: ${doc.fileInfo.projectRelativePath}: tags ${tagged.join(', ')} ignoradas em ${doc.name} (não é item do menu)`);
    return;
  }

  group.menuTags = group.menuTags || { file: doc.fileInfo.projectRelativePath };
  tagged.forEach(tag => {
    if (tag === 'docsShortcut') {
      group.menuTags.docsShortcut = [].concat(group.menuTags.docsShortcut || [], doc.docsShortcut);
    } else if (group.menuTags[tag] === undefined) {
      group.menuTags[tag] = doc[tag];
    }
  });
}

/** Resolve as categorias, mostra avisos, para o build em erro e grava os campos no api-list.json. */
function applyMenuCategories(files, groups) {
  const items = files.map(file => {
    const group = groups.get(file.name) || {};

    return { name: file.name, title: file.title, file: group.menuTags?.file || group.fileInfo?.projectRelativePath, ...group.menuTags };
  });
  const { entries, errors, warnings } = resolveDocsMenu(items, docsCategories);

  warnings.forEach(w => console.warn(`[docs-menu] aviso: ${w.message}`));

  if (errors.length) {
    throw new Error(`[docs-menu] ${errors.length} erro(s) nas tags de categoria:\n${errors.map(e => `  - ${e.message}`).join('\n')}`);
  }

  entries.forEach(entry => {
    const file = files.find(f => f.name === entry.name);
    const group = groups.get(entry.name);

    Object.assign(file, {
      section: entry.section,
      sectionLabel: entry.sectionLabel,
      sectionOrder: entry.sectionOrder,
      category: entry.category,
      categoryLabel: entry.categoryLabel,
      categoryOrder: entry.categoryOrder,
      flat: entry.flat || undefined,
      order: entry.order,
      parent: entry.parent,
      children: entry.children.length ? entry.children : undefined,
      shortcuts: entry.shortcuts.length
        ? entry.shortcuts.map(({ category, categoryLabel, section, sectionLabel }) => ({ category, categoryLabel, section, sectionLabel }))
        : undefined
    });

    // para o template da página (bloco "Subcomponentes" / "Faz parte de")
    if (group) {
      group.menuParent = entry.parent ? files.find(f => f.name === entry.parent) : undefined;
      group.menuChildren = entry.children.map(name => files.find(f => f.name === name));
    }
  });

  const inMenu = entries.filter(e => !e.parent).length;

  console.log(`[docs-menu] ${inMenu} itens no menu, ${entries.length - inMenu} subcomponentes, ` +
    `${entries.reduce((n, e) => n + e.shortcuts.length, 0)} atalhos, ${warnings.length} aviso(s)`);
}

function isPureDirective(doc) {
  const decorators = doc.decorators || [];
  const hasDirective = decorators.some(decorator => decorator.name === 'Directive');
  const hasComponent = decorators.some(decorator => decorator.name === 'Component');

  return hasDirective && !hasComponent;
}
