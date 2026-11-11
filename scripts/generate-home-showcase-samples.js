/**
 * Gera o componente `HomeHeroShowcaseSamplesComponent` (template Angular estático) em
 * `projects/portal/src/app/home/home-hero-showcase/generated/`, com o HTML dos exemplos (PREVIEW_SAMPLES) usados no
 * showcase do Hero da Home.
 *
 * Como funciona: abre a listagem `/documentation` do portal num Chrome sem tela (o mesmo Chrome do Karma, via CHROME_BIN),
 * espera os exemplos serem renderizados, limpa o HTML (sem atributos do Angular, sem ids, sem scripts nem eventos),
 * escapa o que o compilador do Angular interpretaria ({, } e @) e grava um template com `@switch` por nome.
 * Não usa nenhuma dependência além do Node (WebSocket nativo) e do Chrome.
 *
 * Uso: npm run portal:showcase:generate
 *
 *   PORTAL_URL=http://127.0.0.1:4200   usa um portal que já está rodando (padrão: tenta 4200; se não houver, sobe o `ng serve`)
 *   CHROME_BIN=/caminho/do/chrome      Chrome/Chromium a usar (padrão: procura no PATH)
 */
const { spawn, spawnSync } = require('child_process');
const fs = require('fs');
const net = require('net');
const os = require('os');
const path = require('path');

/** Exemplos do showcase, na ordem dos cards. Cada nome é uma chave de PREVIEW_SAMPLES. */
const SAMPLES = [
  'po-tag',
  'po-button',
  'po-switch',
  'po-input',
  'po-select',
  'po-widget',
  'po-radio-group',
  'po-checkbox',
  'po-link',
  'po-badge',
  'po-button-group',
  'po-divider'
];

const OUTPUT_DIR = path.resolve(__dirname, '../projects/portal/src/app/home/home-hero-showcase/generated');
const COMPONENT_FILE = 'home-hero-showcase-samples.component';

/** Atributos que apontam para um id: não podem ser duplicados na página (o showcase repete cada exemplo 3 vezes). */
const ID_ATTRIBUTES = [
  'id',
  'for',
  'list',
  'form',
  'aria-labelledby',
  'aria-describedby',
  'aria-controls',
  'aria-owns',
  'aria-activedescendant'
];

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Escapa o que o compilador de templates do Angular interpretaria: `{{ }}` (interpolação), `{`/`}` (blocos) e `@`
 * (control flow). O texto continua o mesmo para o navegador (entidades HTML).
 */
const escapeForTemplate = html => html.replace(/\{/g, '&#123;').replace(/\}/g, '&#125;').replace(/@/g, '&#64;');

/** Nomes dos atributos de todas as tags (ignora texto e valores de atributos). */
const attributeNames = html => {
  const names = [];
  const tag = /<[a-zA-Z][^\s>/]*((?:\s+[^\s=>/]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+))?)*)\s*\/?>/g;
  const attribute = /\s+([^\s=>/]+)(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+))?/g;
  for (const [, attributes] of html.matchAll(tag)) {
    for (const [, name] of attributes.matchAll(attribute)) {
      names.push(name);
    }
  }
  return names;
};

/** O HTML limpo não pode conter nada executável nem sintaxe de template do Angular. Lança erro se contiver. */
const validateSampleHtml = (name, html) => {
  const forbidden = [
    [/<\s*(script|iframe|object|embed)\b/i, 'tag executável (script/iframe/object/embed)'],
    [/javascript\s*:/i, 'URL javascript:'],
    [/\{\{/, 'interpolação {{ }}']
  ];
  forbidden.forEach(([pattern, description]) => {
    if (pattern.test(html)) {
      throw new Error(`Exemplo "${name}" contém ${description}: ${html.match(pattern)[0]}`);
    }
  });

  attributeNames(html).forEach(attribute => {
    if (/^on[a-z]/i.test(attribute)) {
      throw new Error(`Exemplo "${name}" contém atributo de evento (on*): ${attribute}`);
    }
    if (/^([([*#@]|bind-|bindon-|i18n)/.test(attribute)) {
      throw new Error(`Exemplo "${name}" contém sintaxe de template do Angular em atributo: ${attribute}`);
    }
  });
};

/** Template com um `@case` por exemplo. */
const buildTemplate = samples => {
  const cases = Object.entries(samples).map(([name, html]) => {
    validateSampleHtml(name, html);
    return `  @case ('${name}') {\n    ${escapeForTemplate(html)}\n  }`;
  });
  return `<!-- ARQUIVO GERADO. Não edite à mão. Regere com: npm run portal:showcase:generate (scripts/generate-home-showcase-samples.js) -->\n@switch (name) {\n${cases.join('\n')}\n}\n`;
};

const GENERATED_NOTICE = `ARQUIVO GERADO. Não edite à mão.

HTML estático dos exemplos do showcase do Hero da Home (limpo: sem atributos do Angular, sem ids, sem scripts e sem eventos).
Para regerar (por exemplo, se um exemplo de PREVIEW_SAMPLES ou o componente mudou):

  npm run portal:showcase:generate

O script está em scripts/generate-home-showcase-samples.js.`;

const buildComponent = names => `/**
 * ${GENERATED_NOTICE.split('\n')
   .join('\n * ')
   .replace(/ \* \n/g, ' *\n')}
 */
import { ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA, Input, ViewEncapsulation } from '@angular/core';

/** Nomes dos exemplos (chaves de PREVIEW_SAMPLES), na ordem dos cards. */
export const HOME_HERO_SHOWCASE_SAMPLE_NAMES = ${JSON.stringify(names)};

/**
 * Exemplo estático dos componentes do PO UI. Os elementos \`po-*\` do template ficam como elementos HTML comuns
 * (CUSTOM_ELEMENTS_SCHEMA, sem importar o PoModule): o visual vem das classes do tema.
 */
@Component({
  selector: 'app-home-hero-showcase-samples',
  templateUrl: './${COMPONENT_FILE}.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  // None: sem atributos de escopo; preserveWhitespaces: o espaço entre elementos inline faz parte do visual
  encapsulation: ViewEncapsulation.None,
  preserveWhitespaces: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  standalone: true
})
export class HomeHeroShowcaseSamplesComponent {
  /** Nome do exemplo a mostrar (um dos HOME_HERO_SHOWCASE_SAMPLE_NAMES). */
  @Input() name = '';
}
`;

/** Roda dentro da página: devolve o HTML limpo de cada exemplo. */
const extractSamples = (names, idAttributes) => {
  const clean = element => {
    const clone = element.cloneNode(true);

    // checked/value são propriedades do DOM e se perdem na serialização: copia para atributos
    const live = element.querySelectorAll('input, select, textarea, option');
    clone.querySelectorAll('input, select, textarea, option').forEach((node, index) => {
      const source = live[index];
      if ('checked' in source) {
        source.checked ? node.setAttribute('checked', '') : node.removeAttribute('checked');
      }
      if ('selected' in source) {
        source.selected ? node.setAttribute('selected', '') : node.removeAttribute('selected');
      }
      if (source.tagName === 'INPUT' && source.type !== 'checkbox' && source.type !== 'radio') {
        source.value ? node.setAttribute('value', source.value) : node.removeAttribute('value');
      }
      // rádios com o mesmo name são UM grupo no documento: com as 3 cópias só a última ficaria marcada
      node.removeAttribute('name');
    });

    clone.querySelectorAll('script, iframe, object, embed').forEach(node => node.remove());

    const comments = document.createTreeWalker(clone, NodeFilter.SHOW_COMMENT);
    const toRemove = [];
    while (comments.nextNode()) {
      toRemove.push(comments.currentNode);
    }
    toRemove.forEach(node => node.remove());

    [clone, ...clone.querySelectorAll('*')].forEach(node => {
      Array.from(node.attributes).forEach(({ name, value }) => {
        const angular = /^(_ngcontent|_nghost|ng-reflect)-/.test(name) || name === 'ng-version';
        const event = /^on/i.test(name);
        const syntax = /^[([*#@]/.test(name) || /^(bind-|bindon-|i18n)/.test(name);
        const script = /^\s*javascript:/i.test(value);
        if (angular || event || syntax || script || idAttributes.includes(name)) {
          node.removeAttribute(name);
        }
      });
      ['ng-star-inserted', 'ng-untouched', 'ng-pristine', 'ng-valid'].forEach(className =>
        node.classList.remove(className)
      );
      if (!node.classList.length) {
        node.removeAttribute('class');
      }
    });

    return clone.outerHTML;
  };

  const result = {};
  const missing = [];
  names.forEach(name => {
    const element = document.querySelector(`app-preview-${name}`);
    element ? (result[name] = clean(element)) : missing.push(name);
  });
  return { result, missing };
};

const freePort = () =>
  new Promise((resolve, reject) => {
    const server = net.createServer();
    server.listen(0, '127.0.0.1', () => {
      const { port } = server.address();
      server.close(() => resolve(port));
    });
    server.on('error', reject);
  });

const isUp = async url => {
  try {
    return (await fetch(url)).ok;
  } catch {
    return false;
  }
};

const findChrome = () => {
  if (process.env.CHROME_BIN) {
    return process.env.CHROME_BIN;
  }
  for (const name of ['google-chrome', 'google-chrome-stable', 'chromium', 'chromium-browser', 'chrome']) {
    const found = spawnSync('which', [name], { encoding: 'utf8' });
    if (found.status === 0) {
      return found.stdout.trim();
    }
  }
  throw new Error('Chrome não encontrado. Defina CHROME_BIN com o caminho do Chrome/Chromium.');
};

async function main() {
  const children = [];
  const cleanup = () => children.forEach(child => child.kill());
  process.on('exit', cleanup);

  // 1. portal
  let baseUrl = process.env.PORTAL_URL || 'http://127.0.0.1:4200';
  if (!(await isUp(baseUrl))) {
    const port = await freePort();
    baseUrl = `http://127.0.0.1:${port}`;
    console.log(`Portal não encontrado: subindo o ng serve em ${baseUrl} (pode levar alguns minutos)...`);
    const serve = spawn('npx', ['ng', 'serve', 'portal', '--host', '127.0.0.1', '--port', String(port)], {
      cwd: path.resolve(__dirname, '..'),
      stdio: 'ignore'
    });
    children.push(serve);
    for (let i = 0; i < 180 && !(await isUp(baseUrl)); i++) {
      await sleep(2000);
    }
    if (!(await isUp(baseUrl))) {
      throw new Error('O ng serve não respondeu a tempo.');
    }
  }

  // 2. Chrome sem tela, controlado pelo protocolo DevTools
  const debugPort = await freePort();
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'po-showcase-'));
  children.push(
    spawn(
      findChrome(),
      [
        '--headless=new',
        '--disable-gpu',
        '--no-sandbox',
        `--remote-debugging-port=${debugPort}`,
        `--user-data-dir=${profile}`,
        'about:blank'
      ],
      { stdio: 'ignore' }
    )
  );

  let targets;
  for (let i = 0; i < 50; i++) {
    try {
      targets = await (await fetch(`http://127.0.0.1:${debugPort}/json`)).json();
      if (targets.length) break;
    } catch {
      /* Chrome ainda subindo */
    }
    await sleep(200);
  }
  const socket = new WebSocket(targets.find(target => target.type === 'page').webSocketDebuggerUrl);
  await new Promise(resolve => (socket.onopen = resolve));

  let nextId = 0;
  const pending = new Map();
  socket.onmessage = event => {
    const message = JSON.parse(event.data);
    pending.get(message.id)?.(message.result ?? message);
  };
  const send = (method, params = {}) =>
    new Promise(resolve => {
      const id = ++nextId;
      pending.set(id, resolve);
      socket.send(JSON.stringify({ id, method, params }));
    });
  const evaluate = async expression =>
    (await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true })).result?.value;
  const extract = () =>
    evaluate(`(${extractSamples.toString()})(${JSON.stringify(SAMPLES)}, ${JSON.stringify(ID_ATTRIBUTES)})`);

  await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
  await send('Page.enable');
  await send('Page.navigate', { url: `${baseUrl}/documentation` });

  // 3. espera os exemplos (a listagem os cria quando o card entra na tela: rola até cada placeholder)
  let extracted;
  for (let attempt = 0; attempt < 120; attempt++) {
    await sleep(500);
    await evaluate(
      `document.querySelectorAll('.documentation-preview-skeleton').forEach(el => el.scrollIntoView({ block: 'center' }))`
    );
    extracted = await extract();
    if (extracted && extracted.missing.length === 0) {
      // ngModel e outros estados iniciais são aplicados depois da primeira renderização: espera antes de copiar
      await sleep(2000);
      extracted = await extract();
      break;
    }
  }
  if (!extracted || extracted.missing.length) {
    throw new Error(`Exemplos não encontrados na listagem: ${extracted?.missing.join(', ')}`);
  }

  // 4. grava (o prettier ignora esta pasta: o espaço entre elementos inline faz parte do visual)
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  fs.writeFileSync(path.join(OUTPUT_DIR, `${COMPONENT_FILE}.html`), buildTemplate(extracted.result));
  fs.writeFileSync(path.join(OUTPUT_DIR, `${COMPONENT_FILE}.ts`), buildComponent(SAMPLES));

  console.log(`Gerado: ${path.relative(process.cwd(), OUTPUT_DIR)} (${SAMPLES.length} exemplos)`);
  socket.close();
  cleanup();
  await sleep(500); // Chrome ainda está encerrando e gravando no perfil
  fs.rmSync(profile, { recursive: true, force: true, maxRetries: 5, retryDelay: 300 });
}

if (require.main === module) {
  main().then(
    () => process.exit(0),
    error => {
      console.error(error.message);
      process.exit(1);
    }
  );
}

module.exports = { SAMPLES, escapeForTemplate, attributeNames, validateSampleHtml, buildTemplate, buildComponent };
