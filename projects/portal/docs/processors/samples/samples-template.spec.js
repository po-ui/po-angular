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

  it('abas com texto: Preview (ativa, com o exemplo no container) e depois as de código', () => {
    const tabs = [...out.matchAll(/<po-tab p-label="(\w+)"( p-active)?>/g)].map(t => t[1] + (t[2] ? '*' : ''));
    const preview = out.match(/<po-tab p-label="Preview" p-active>([\s\S]*?)<\/po-tab>/)[1];

    expect(tabs).toEqual(['Preview*', 'HTML', 'TS', 'CSS']);
    expect(preview).toMatch(/<div class="docs-sample-container">\s*<sample-po-x>\s*<\/sample-po-x>\s*<\/div>/);
    expect(out.match(/<sample-po-x>/g).length).toBe(1);
    expect(out).not.toMatch(/po-button-group|viewButtons|\[hidden\]/);
  });

  it('título do sample só com o label (e o id do deep link), sem o link antigo', () => {
    expect(out).toMatch(
      /<blockquote class="sample-blockquote" id="sample-po-x">\s*<label class="sample-title[^>]*>X<\/label>\s*<\/blockquote>\s*<div data-tour="sample-tabs">\s*<po-tabs/
    );
    expect(out).not.toMatch(/show-me-the-code|toggleSampleCodeTabs|sampleCodeButton|hideSampleCodeTabs/);
  });
});
