const path = require('path');

// mesmo nunjucks e mesma configuração do Dgeni (`docs/index.js`: tags `{$ $}`, autoescape desligado)
const nunjucks = require(require.resolve('nunjucks', { paths: [require.resolve('dgeni-packages/nunjucks')] }));

const env = new nunjucks.Environment(
  new nunjucks.FileSystemLoader(path.resolve(__dirname, '../../templates/samples')),
  {
    autoescape: false,
    tags: { variableStart: '{$', variableEnd: '$}' }
  }
);

const file = (name, fileContents) => ({ path: name, fileContents });

/** O que o navegador mostra no `<pre>` (`textContent`): tira as tags e decodifica as entidades. */
const textContent = html =>
  html
    .replace(/<span ngNonBindable>([^<]*)<\/span>/g, '$1')
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&');

describe('samples: index.template.html', () => {
  const html = file(
    'sample-po-x/sample-po-x.component.html',
    '<p [a]="b">{{ total }} {{{ x }}}</p>\n@if (a) { <b>&nbsp;</b> }\n'
  );
  const ts = file(
    'sample-po-x/sample-po-x.component.ts',
    "const o = { a: { b: 1 } };\nconst t = `${'{'}{ x }}`;\n// { { já separado } }\n"
  );
  const css = file('sample-po-x/sample-po-x.component.css', '@media (max-width: 1px) {\n  .a { color: red; }\n}\n');
  const out = env.render('index.template.html', {
    doc: { id: 'sample-po-x', title: 'X', files: [html], scripts: [ts], stylesheets: [css], tests: [] }
  });
  const blocks = [
    ...out.matchAll(
      /<div class="docs-code-block" data-file="([^"]+)"><pre appCodeHighlight class="(\w+)">([\s\S]*?)<\/pre><\/div>/g
    )
  ];

  it('um bloco por arquivo, com o nome do arquivo e a linguagem', () => {
    expect(blocks.map(b => [b[1], b[2]])).toEqual([
      [html.path, 'html'],
      [ts.path, 'typescript'],
      [css.path, 'css']
    ]);
  });

  it('o texto do bloco é igual ao arquivo (sem "{ {"), para tela e cópia', () => {
    expect(blocks.map(b => textContent(b[3]))).toEqual([html.fileContents, ts.fileContents, css.fileContents]);
  });

  it('o Angular não vê interpolação, chave nem @ cru fora do ngNonBindable', () => {
    blocks.forEach(b => {
      const outside = b[3].replace(/<span ngNonBindable>[^<]*<\/span>/g, '');

      expect(outside).not.toMatch(/[{}@]/);
    });
  });
});
