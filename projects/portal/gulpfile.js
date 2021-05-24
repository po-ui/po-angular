const gulp = require('gulp');
const Dgeni = require('dgeni');
const hljs = require('highlight.js');
const tap = require('gulp-tap');
const del = require('del');
const fs = require('fs');
const path = require('path');
const configuration = require('./docs/configuration');
const util = require('./docs/util');
const marked = require('marked');
const _ = require('lodash');

const APP_DIR = './src/app';

const GUIDE_DIR = `${APP_DIR}/guide/guides`;

const MENU_SERVICE_TEMPLATE = './docs/templates/menu.service.template.ts';
const MENU_GUIDES_SERVICE_TEMPLATE = './docs/templates/menu-guides.service.template.ts';
const MENU_COMPONENTS_SERVICE_TEMPLATE = './docs/templates/menu-components.service.template.ts';

const replaceBrackets = str =>
  str
    .replace(/\{\{/g, '<span ngNonBindable>{{</span>')
    .replace(/\}\}/g, '<span ngNonBindable>}}</span>')
    .replace(/\{/g, '&#123;')
    .replace(/\}/g, '&#125;');

const markdownToHtml = markdown =>
  replaceBrackets(
    marked(markdown, {
      highlight: (code, language) => {
        if (language) {
          return hljs.highlight(language.toLowerCase() === 'ts' ? 'typescript' : language, code).value;
        }
        return code;
      }
    })
  );

const markdownCommentsToObject = markdown =>
  markdown.match(/\[comment\]\:\s\#\s\(@(.+)\)/g).reduce((comments, currentComment) => {
    const tag = currentComment.match(/^\[comment\]\:\s\#\s\(@(.+)\)$/)[1].split(' ');
    const tagName = tag[0];
    const tagValue = tag.splice(1, tag.length).join(' ');

    Object.assign(comments, { [tagName]: tagValue });

    return comments;
  }, {});

const upperCamelCase = str =>
  _.words(str)
    .map(word => _.upperFirst(word))
    .join('');

const compiledTemplate = (template, data) => _.template(fs.readFileSync(template))(data);

const mkdir = dir => {
  del.sync(dir);
  fs.mkdirSync(dir);
};
const mkdirDocComponent = (path, componentName, moduleName) => mkdir(`${path}/${moduleName}-${componentName}`);

const writeFile = (file, data) => fs.writeFileSync(file, data, 'utf-8');
const saveDocComponent = (path, componentName, moduleName, data) =>
  writeFile(`${path}/${moduleName}-${componentName}/${moduleName}-${componentName}.component.ts`, data);
const saveDocView = (path, componentName, moduleName, data) =>
  writeFile(`${path}/${moduleName}-${componentName}/${moduleName}-${componentName}.component.html`, data);
const saveDocModule = (moduleName, data) => writeFile(`${APP_DIR}/${moduleName}/${moduleName}.module.ts`, data);
const saveDocRoutingModule = (moduleName, data) =>
  writeFile(`${APP_DIR}/${moduleName}/${moduleName}-routing.module.ts`, data);

const saveMenuService = data => writeFile(`${APP_DIR}/menu.service.ts`, data);
const saveMenuGuidesService = data => writeFile(`${APP_DIR}/guide/menu-guides.service.ts`, data);
const saveMenuComponentsService = data => writeFile(`${APP_DIR}/documentation/menu-components.service.ts`, data);

const createDocs = (file, pathDir, moduleName) => {
  const DOC_VIEW_TEMPLATE = `./docs/templates/${moduleName}/${moduleName}.view.template.html`;
  const DOC_COMPONENT_TEMPLATE = `./docs/templates/${moduleName}/${moduleName}.component.template.ts`;

  const fileName = path.basename(file.path, '.md');
  const markdown = file.contents.toString();
  const comments = markdownCommentsToObject(markdown);

  const doc = {
    fileName: fileName,
    name: upperCamelCase(fileName),
    markdown: markdown,
    html: markdownToHtml(markdown),
    label: comments.label,
    link: comments.link,
    orderBy: comments.orderBy || 999
  };

  mkdirDocComponent(pathDir, doc.fileName, moduleName);

  doc.html = compiledTemplate(DOC_VIEW_TEMPLATE, {
    label: doc.label,
    html: doc.html
  });
  saveDocView(pathDir, doc.fileName, moduleName, doc.html);

  doc.component = compiledTemplate(DOC_COMPONENT_TEMPLATE, {
    component: doc.name,
    templateUrl: doc.fileName
  });
  saveDocComponent(pathDir, fileName, moduleName, doc.component);

  return doc;
};

const createDocsModule = (docs, moduleName) => {
  const DOC_ROUTING_MODULE_TEMPLATE = `./docs/templates/${moduleName}/${moduleName}-routing.module.template.ts`;
  const DOC_MODULE_TEMPLATE = `./docs/templates/${moduleName}/${moduleName}.module.template.ts`;

  if (!menuItems[moduleName]) {
    menuItems[moduleName] = [];
  }

  docs.forEach(doc =>
    menuItems[moduleName].push({
      label: doc.label,
      link: doc.link,
      name: doc.name,
      path: doc.fileName,
      orderBy: doc.orderBy
    })
  );

  const docModule = compiledTemplate(DOC_MODULE_TEMPLATE, {
    docItems: menuItems[moduleName]
  });
  saveDocModule(moduleName, docModule);

  const docRoutingModule = compiledTemplate(DOC_ROUTING_MODULE_TEMPLATE, {
    docItems: menuItems[moduleName]
  });

  saveDocRoutingModule(moduleName, docRoutingModule);
};

const clone = (name, url, path, cb) => {
  git.clone(url, { args: path }, function (err) {
    if (err) throw err;
    cb();
  });
};

const pull = (name, path, cb) => {
  git.pull('origin', 'master', { args: '--rebase', cwd: path }, function (err) {
    if (err) throw err;
    cb();
  });
};

const checkout = (projectName, branch, path) => {
  git.checkout(branch, { cwd: path }, function (err) {
    if (err) throw err;
  });
};

const menuItems = {};
const configurations = util.configurations;

/**
 * Gera documentação utilizando Dgeni por meio dos comentários em JsDoc nos arquivos fonte
 *
 * @task {build:api}
 */
gulp.task('build:api', () => {
  // This will import the index.js from the /docs/config folder and will use that
  let dgeni = new Dgeni([require('./docs')]);
  return dgeni.generate();
});

/**
 * Gera guias em HTML para o portal a partir de arquivos markdown.
 *
 * @task {build:guides}
 */
gulp.task('build:guides', () => {
  const util = require('./docs/util');
  const poProjectsNames = util.projectsNames();
  let guides = [];
  let sources = [];

  mkdir(GUIDE_DIR);

  poProjectsNames.forEach(project => {
    sources.push(`${configuration.sourceFolder}/${project}/docs/guides/*.md`);
  });

  return gulp
    .src(sources, {})
    .pipe(tap(file => guides.push(createDocs(file, GUIDE_DIR, 'guide'))))
    .pipe(gulp.dest(file => file.base))
    .on('end', () => createDocsModule(guides, 'guide'));
});

/**
 * Gera guias em HTML para o portal a partir de arquivos markdown.
 *
 * @task {build:menus}
 */
gulp.task('build:menus', done => {
  const menuService = compiledTemplate(MENU_SERVICE_TEMPLATE, { menuItems });
  const menuGuidesService = compiledTemplate(MENU_GUIDES_SERVICE_TEMPLATE, {
    menuItems
  });
  const menuComponentsService = compiledTemplate(MENU_COMPONENTS_SERVICE_TEMPLATE, { menuItems });

  saveMenuService(menuService);
  saveMenuGuidesService(menuGuidesService);
  saveMenuComponentsService(menuComponentsService);
  done();
});

/**
 * Limpa arquivos de documentação
 * @task {clean-docs}
 */
gulp.task('clean-docs', () => {
  return del([
    'dist/',
    'build/',
    'src/app/guide/guides',
    'src/app/documentation/samples/',
    'src/app/menu.service.ts',
    'src/assets/json/api-list.json',
    'src/app/documentation/documentation-routing.module.ts'
  ]);
});

/**
 * Adiciona os scripts do google analytics e hotjar caso receba os respectivos IDs
 *
 * @task {build:analytics}
 */
gulp.task('build:analytics', done => {
  let htmlContent;
  let path = './src/index.html';
  let googleAnalyticsID = configuration.googleAnalyticsID;
  let hotjarID = configuration.hotjarID;

  if (googleAnalyticsID) {
    htmlContent = fs.readFileSync(path, 'utf8');
    const googleContent = `
      <script async src="https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsID}"></script>
      <script>
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${googleAnalyticsID}');
      </script>`;
    fs.writeFileSync(path, htmlContent.replace(/<!-- GOOGLE ANALYTICS -->/g, googleContent));
  }

  if (hotjarID) {
    htmlContent = fs.readFileSync(path, 'utf8');
    const hotjarContent = `
      <script>
      (function(h,o,t,j,a,r){
        h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
        h._hjSettings={hjid:${hotjarID},hjsv:6};
        a=o.getElementsByTagName('head')[0];
        r=o.createElement('script');r.async=1;
        r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
        a.appendChild(r);
      })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
      </script>`;
    fs.writeFileSync(path, htmlContent.replace(/<!-- HOTJAR -->/g, hotjarContent));
  }
  done();
});

gulp.task('build', gulp.series('clean-docs', 'build:api', 'build:guides', 'build:menus', 'build:analytics'));
