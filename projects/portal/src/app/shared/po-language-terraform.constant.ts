// Constante utilizada para registrar uma nova linguagem no po-code-editor.

export const customLanguage = {
  language: 'terraform',
  options: {
    keywords: ['resource', 'provider', 'variable', 'output', 'module', 'true', 'false'],
    operators: ['{', '}', '(', ')', '[', ']', '?', ':'],
    symbols: new RegExp('[=><!~?:&|+\\-*\\/\\^%]+'),
    escapes: new RegExp(`\\\\(?:[abfnrtv\\\\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})`),
    tokenizer: {
      root: [
        [`[a-z_$][\\w$]*`, { cases: { '@keywords': 'keyword', '@default': 'identifier' } }],
        { include: '@whitespace' },
        [`\\d*\\.\\d+([eE][\\-+]?\\d+)?`, 'number.float'],
        [`0[x][0-9a-fA-F]+`, 'number.hex'],
        [`\\d+`, 'number'],
        [`[;,.]`, 'delimiter'],
        [`\"([^\"\\\\]|\\\\.)*$`, 'string.invalid'],
        [`\"`, { token: 'string.quote', bracket: '@open', next: '@string' }],
        [`'[^\\\\']'`, 'string'],
        [`'`, 'string.invalid']
      ],
      comment: [
        [`[^\\/*]+`, 'comment'],
        [`[\\/*]`, 'comment'],
        [`[\\#.*]`, 'comment']
      ],
      string: [
        [`[^\\\\\"\\$]+`, 'string'],
        [`\\$`, 'string.interpolated', '@interpolated'],
        [`\\\\.`, 'string.escape.invalid'],
        [`\"`, { token: 'string.quote', bracket: '@close', next: '@pop' }]
      ],
      whitespace: [
        [`[ \\t\\r\\n]+`, 'white'],
        [`\\/\\/.*$`, 'comment'],
        [`\\#.*$`, 'comment']
      ],
      interpolated: [
        [`[{]`, { token: 'string.escape.curly', switchTo: '@interpolated_compound' }],
        ['', '', '@pop']
      ]
    }
  }
};
