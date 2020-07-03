const capitalize = require('capitalize');

/** Functions and class used to group components, interfaces by modules  */
module.exports = {
  /** Component group data structure. */
  ComponentGroup: class {
    constructor(name) {
      this.name = name;
      this.id = `component-group-${name}`;
      this.aliases = [];
      this.docType = 'componentGroup';
      this.directives = [];
      this.services = [];
      this.interfaces = [];
      this.models = [];
      this.enums = [];
      this.additionalClasses = [];
      this.ngModule = null;
      this.types = [];
      this.package = '';
    }
  },
  /** Search docs to find component's module  */
  resolveModuleDoc: function (groupNamePath, docs) {
    const dashedComponentName = groupNamePath[4];
    if (dashedComponentName) {
      var moduleName = dashedComponentName.split('-');

      moduleName.forEach(function (part, index) {
        moduleName[index] = capitalize(part);
      });

      moduleName = moduleName.join('');
      moduleName = `${moduleName}Module`;

      return docs.filter(doc => doc.name == moduleName)[0];
    }

    return [];
  },

  /** Returns capitalized name, ex: po-chart to PoChart */
  resolveCapitalizedComponentName: function (moduleDoc) {
    let componentName = moduleDoc.name
      .match(/^(.+?)\.?(component|service|directive|module|interceptor|model)?(\.(ts))?$/)[1]
      .split('-');

    componentName.forEach(function (part, index) {
      componentName[index] = capitalize(part);
    });

    return componentName;
  },

  /** Adds interfaces do docs based on the tag @usedBy  */
  resolveInterfaceDocs: function (doc, docs, groups) {
    doc.usedBy.split(',').forEach(function (name) {
      let componentsDoc = docs.filter(d => d.name == name.trim());

      if (componentsDoc.lenght === 0) {
        console.warn(`warn`.yellow + ':   ', `Componente ${name} da interface ${doc.name} não encontrado!`);
      }

      componentsDoc.forEach(componentDoc => {
        const componentName = componentDoc.moduleDoc.name.match(
          /^(.+?)\.?(component|service|model|directive|module|interceptor)?(\.(ts))?$/
        )[1];

        let componentGroup = groups.get(componentName);
        if (componentGroup) {
          componentGroup.interfaces.push(doc);
        } else {
          console.warn(`warn`.yellow + ':   ', `Componente ${componentName} da interface ${doc.name} não encontrado!`);
        }
      });
    });
  },
  /** Adds interfaces do docs based on the tag @usedBy  */
  resolveEnumDocs: function (doc, docs, groups) {
    doc.usedBy.split(',').forEach(function (name) {
      let componentDoc = docs.find(d => d.name == name.trim());

      if (componentDoc) {
        const componentName = componentDoc.moduleDoc.name.match(
          /^(.+?)\.?(component|service|model|directive|module|interceptor)?(\.(ts))?$/
        )[1];

        let componentGroup = groups.get(componentName);

        if (componentGroup) {
          componentGroup.enums.push(doc);
        } else {
          console.warn(`warn`.yellow + ':   ', `Componente ${componentName} do enum ${doc.name} não encontrado!`);
        }
      } else {
        console.warn(`warn`.yellow + ':   ', `Componente ${name} do enum ${doc.name} não encontrado!`);
      }
    });
  }
};
