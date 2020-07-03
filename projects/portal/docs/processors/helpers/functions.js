module.exports = {
  /**
   * Method that process description and properties from class and extended class
   */
  processClassBasics: function (classDoc, allDocs) {
    classDoc.properties = [];
    classDoc.methods = [];

    //Extends
    if (classDoc.docsExtends) {
      let extendedDoc = allDocs.filter(doc => doc.name == classDoc.docsExtends)[0];

      if (extendedDoc) {
        let description = classDoc.description;

        classDoc.description = `${extendedDoc.description} ${description}`;
        classDoc.properties = this.resolveProperties(extendedDoc);
        classDoc.methods = this.resolveMethods(extendedDoc);
      } else {
        console.warn(`Classe ${classDoc.docsExtends} extended by ${classDoc.name} não encontrada!`.red);
      }
    }

    // Resolve all methods and properties from the classDoc. Includes inherited docs.
    classDoc.methods = classDoc.methods.concat(this.resolveMethods(classDoc));
    classDoc.properties = classDoc.properties.concat(this.resolveProperties(classDoc)).sort((a, b) => {
      return a.name > b.name ? 1 : -1;
    });

    if (classDoc.docType === 'enum') {
      classDoc.enums = this.resolveEnums(classDoc);
    }

    // Call process hooks that can modify the method and property docs.
    //classDoc.methods.forEach(doc => processMethodDoc(doc));
    classDoc.properties.forEach(doc => this.processPropertyDoc(doc));
  },
  /**
   * Method that will be called for each method doc. The parameters for the method-docs
   * will be normalized, so that they can be easily used inside of dgeni templates.
   */
  processMethodDoc: function (methodDoc) {
    this.normalizeMethodParameters(methodDoc);
    this.processPublicDoc(methodDoc);

    // Mark methods with a `void` return type so we can omit show the return type in the docs.
    methodDoc.showReturns = methodDoc.returnType && methodDoc.returnType != 'void';
  },

  /**
   * Method that will be called for each property doc. Properties that are Angular inputs or
   * outputs will be marked. Aliases for the inputs or outputs will be stored as well.
   */
  processPropertyDoc: function (propertyDoc) {
    this.processPublicDoc(propertyDoc);

    propertyDoc.isDirectiveInput = this.isDirectiveInput(propertyDoc);
    propertyDoc.directiveInputAlias = this.getDirectiveInputAlias(propertyDoc);

    propertyDoc.isDirectiveOutput = this.isDirectiveOutput(propertyDoc);
    propertyDoc.directiveOutputAlias = this.getDirectiveOutputAlias(propertyDoc);
  },

  /**
   * processs public exposed docs. Creates a property on the doc that indicates whether
   * the item is deprecated or not.
   **/
  processPublicDoc: function (doc) {
    doc.isDeprecated = this.isDeprecatedDoc(doc);
  },

  /** Function that walks through all inherited docs and collects public methods. */
  resolveMethods: function (classDoc) {
    let methods = classDoc.members.filter(member => member.hasOwnProperty('parameters'));
    return methods.filter(method => method.tags.description);
  },

  /** Function that walks through all inherited docs and collects public properties. */
  resolveProperties: function (classDoc) {
    let properties = classDoc.members.filter(member => !member.hasOwnProperty('parameters'));

    properties.forEach(function (property, index) {
      if (property.type.includes('EventEmitter')) {
        properties[index].type = property.type = 'EventEmitter';
      }
      if (property.optional !== undefined) {
        property.isOptional = true;
      }
    });

    properties = properties.filter(property => property.description && property.type);

    return properties ? properties : [];
  },

  /** Function that walks through all inherited docs and collects public enums. */
  resolveEnums: function (classDoc) {
    let enums = classDoc.members.filter(member => !member.hasOwnProperty('enum'));

    return enums ? enums : [];
  },

  /**
   * The `parameters` property are the parameters extracted from TypeScript and are strings
   * of the form "propertyName: propertyType" (literally what's written in the source).
   *
   * The `params` property is pulled from the `@param` JsDoc tag. We need to merge
   * the information of these to get name + type + description.
   *
   * We will use the `params` property to store the final normalized form since it is already
   * an object.
   */
  normalizeMethodParameters: function (method) {
    if (method.parameters) {
      method.parameters.forEach(parameter => {
        let [parameterName, parameterType] = parameter.split(':');

        // If the parameter is optional, the name here will contain a '?'. We store whether the
        // parameter is optional and remove the '?' for comparison.
        let isOptional = false;
        if (parameterName.includes('?')) {
          isOptional = true;
          parameterName = parameterName.replace('?', '');
        }

        if (!method.params) {
          method.params = [];
        }

        let jsDocParam = method.params.find(p => p.name == parameterName);

        if (!jsDocParam) {
          jsDocParam = {
            name: parameterName,
            type: parameterType
          };
          method.params.push(jsDocParam);
        }
        jsDocParam.type = parameterType.trim();
        jsDocParam.isOptional = isOptional;
      });
    }
  },

  normalizeParameters: function (doc) {
    if (doc.parameters) {
      doc.parameters.forEach(parameter => {
        let [parameterName, parameterType] = parameter.split(':');

        // If the parameter is optional, the name here will contain a '?'. We store whether the
        // parameter is optional and remove the '?' for comparison.
        let isOptional = false;
        if (parameterName.includes('?')) {
          isOptional = true;
          parameterName = parameterName.replace('?', '');
        }

        if (!doc.params) {
          doc.params = [];
        }

        let jsDocParam = doc.params.find(p => p.name == parameterName);

        if (!jsDocParam) {
          jsDocParam = {
            name: parameterName,
            type: parameterType
          };
          doc.params.push(jsDocParam);
        }
        jsDocParam.type = parameterType.trim();
        jsDocParam.isOptional = isOptional;
      });
    }
  },

  isDirective: function (doc) {
    return this.hasClassDecorator(doc, 'Component') || this.hasClassDecorator(doc, 'Directive');
  },

  isModel: function (doc) {
    return doc.originalModule.endsWith('.model');
  },

  isService: function (doc) {
    return this.hasClassDecorator(doc, 'Injectable');
  },

  isNgModule: function (doc) {
    return this.hasClassDecorator(doc, 'NgModule');
  },

  isInterface: function (doc) {
    return doc.docType == 'interface';
  },

  isEnum: function (doc) {
    return doc.docType == 'enum';
  },

  isDirectiveOutput: function (doc) {
    return this.hasMemberDecorator(doc, 'Output');
  },

  isDirectiveInput: function (doc) {
    return this.hasMemberDecorator(doc, 'Input');
  },

  isDeprecatedDoc: function (doc) {
    return ((doc.tags && doc.tags.tags) || []).some(tag => tag.tagName === 'deprecated');
  },

  getDirectiveInputAlias: function (doc) {
    return this.isDirectiveInput(doc) ? doc.decorators.find(d => d.name == 'Input').arguments[0] : '';
  },

  getDirectiveOutputAlias: function (doc) {
    return this.isDirectiveOutput(doc) ? doc.decorators.find(d => d.name == 'Output').arguments[0] : '';
  },

  getDirectiveSelectors: function (classDoc) {
    const directiveSelectors = this.getMetadataProperty(classDoc, 'selector');

    if (directiveSelectors) {
      // Remove line-breaks in resolved selectors.
      return directiveSelectors
        .replace(/[\r\n]/g, '')
        .split(/\s*,\s*/)
        .filter(s => s !== '' && !s.includes('mat'));
    }
  },

  getMetadataProperty: function (doc, property) {
    const metadata = doc.decorators.find(d => d.name === 'Component' || d.name === 'Directive').arguments[0];

    // Use a Regex to determine the given metadata property. This is necessary, because we can't
    // parse the JSON due to environment variables inside of the JSON (e.g module.id)
    let matches = new RegExp(`${property}s*:\\s*(?:"|'|\`)((?:.|\\n|\\r)+?)(?:"|'|\`)`).exec(metadata);

    return matches && matches[1].trim();
  },

  hasMemberDecorator: function (doc, decoratorName) {
    return doc.docType == 'member' && this.hasDecorator(doc, decoratorName);
  },

  hasClassDecorator: function (doc, decoratorName) {
    return doc.docType == 'class' && this.hasDecorator(doc, decoratorName);
  },

  hasDecorator: function (doc, decoratorName) {
    return doc.decorators && doc.decorators.length && doc.decorators.some(d => d.name == decoratorName);
  }
};
