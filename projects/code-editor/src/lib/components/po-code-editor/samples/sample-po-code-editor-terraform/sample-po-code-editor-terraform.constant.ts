import { PoCodeEditorRegisterable } from '@portinari/portinari-code-editor';

declare const monaco: any;

/** Definição da lista de sugestões para o autocomplete.
 *
 * > A função `provideCompletionItems` precisa ser exportada para ser compatível com AOT.
 *
 * Documentação: https://microsoft.github.io/monaco-editor/playground.html#extending-language-services-custom-languages
 */
export function provideCompletionItems() {
  const suggestions = [
    {
      label: 'terraform',
      kind: monaco.languages.CompletionItemKind.Text,
      insertText: '#terraform language'
    }, {
      label: 'resource',
      documentation: 'Read more in https://www.terraform.io/docs/configuration/resources.html',
      insertText: [
        'resource "${1:instance}" "${2:type}" {',
        '\tami           = "${3:ami}"',
        '\tinstance_type = "${4:instance_type}"',
        '}'
      ].join('\n'),
      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
    }, {
      label: 'provider',
      documentation: 'Read more in https://www.terraform.io/docs/configuration/providers.html',
      insertText: [
        'provider "${1:name}" {',
        '\tproject = "${2:project}"',
        '\tregion  = "${3:region}"',
        '}'
      ].join('\n'),
      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
    }, {
      label: 'server',
      insertText: 'server ${1:ip}',
      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
    }
  ];

  return { suggestions: suggestions };
}

/** Definindo propriedades de uma nova sintaxe. */
export const customRegister: PoCodeEditorRegisterable = {

  language: 'terraform',
  options: {
    keywords: [ 'resource', 'provider', 'variable', 'output', 'module', 'true', 'false' ],
    operators: [ '{', '}', '(', ')', '[', ']', '?', ':' ],
    symbols:  new RegExp('[=><!~?:&|+\\-*\\/\\^%]+'),
    escapes: new RegExp(`\\\\(?:[abfnrtv\\\\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})`),
    tokenizer: {
      root: [
        [`[a-z_$][\\w$]*`, { cases: { '@keywords': 'keyword', '@default': 'identifier' } }],
        { include: '@whitespace' },
        [`\\d*\\.\\d+([eE][\\-+]?\\d+)?`, 'number.float'],
        [`0[x][0-9a-fA-F]+`, 'number.hex'],
        [`\\d+`, 'number'],
        [`[;,.]`, 'delimiter'],
        [`\"([^\"\\\\]|\\\\.)*$`, 'string.invalid' ],
        [`\"`,  { token: 'string.quote', bracket: '@open', next: '@string' } ],
        [`'[^\\\\']'`, 'string'],
        [`'`, 'string.invalid']
      ],
      comment: [
        [`[^\\/*]+`, 'comment' ],
        [`[\\/*]`, 'comment' ],
        [`[\\#.*]`, 'comment']
      ],
      string: [
        [`[^\\\\\"\\$]+`,  'string'],
        [`\\$`, 'string.interpolated', '@interpolated'],
        [`\\\\.`, 'string.escape.invalid'],
        [`\"`, { token: 'string.quote', bracket: '@close', next: '@pop' } ]
      ],
      whitespace: [
        [`[ \\t\\r\\n]+`, 'white'],
        [`\\/\\/.*$`,    'comment'],
        [`\\#.*$`,    'comment'],
      ],
      interpolated: [
        [`[{]`, { token: 'string.escape.curly', switchTo: '@interpolated_compound' }],
        ['', '', '@pop'],
      ],
    },
  },
  suggestions: { provideCompletionItems: provideCompletionItems }
};
