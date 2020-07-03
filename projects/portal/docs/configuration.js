const tfsSsh = 'ssh://git@github.com:po-ui';
const tfsHttps = 'https://github.com/po-ui';
const portalVersion = require('../../../package.json').version;
const urlProject = project => {
  return {
    ssh: `${tfsSsh}/${project}.git`,
    https: `${tfsHttps}/${project}`
  };
};

module.exports = {
  /** Base folder that contains PO Projects */
  sourceFolder: (process.env.PO_PORTAL_PATH || './../../..') + '/',

  /** Version of portal ( master or package.json version ) */
  version: process.env.VERSION || portalVersion,

  /** Google ID used in Google Analytics */
  googleAnalyticsID: 'UA-112496808-2',

  /** Hotjar ID */
  hotjarID: process.env.HOTJAR_ID,

  /** Folder of PO Projects do document */
  poProjects: [
    {
      name: 'po-angular',
      url: urlProject('po-angular'),
      version: portalVersion
    },
    {
      name: 'po-style',
      url: urlProject('po-style'),
      version: portalVersion
    },
    {
      name: 'po-tslint',
      url: urlProject('po-tslint'),
      version: portalVersion
    }
  ],

  /** Folder that contains api templates */
  outputFolder: 'src/app/documentation/samples/',

  /** Folder that contains api templates */
  templateApiFolder: 'templates/api',

  /** Folder that contains sample templates */
  templateSampleFolder: 'templates/samples',

  /** Custom Dgeni JsDoc Tags */
  customTags: [
    { name: 'docsPrivate' },
    { name: 'runnableExample' },
    { name: 'example' },
    { name: 'examplePrivate' },
    { name: 'description' },
    { name: 'docsExtends' },
    { name: 'usedBy' },
    { name: 'optional' },
    { name: 'default' }
  ],

  protractorWebBaseUrl: `browser.baseUrl + '/documentation/{component}?view=web'`
};
