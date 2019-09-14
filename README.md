# Introdução

Repositório dos arquivos de estilo do PO Core.

Esse repositório é usado para atualizar o CDN PO Core que deve ser utilizado como base por todos os projetos front-end da Portinari.

# Processo de design

Antes de desenvolver um novo componente, verifique se o protótipo tem a especificação para os seguintes status:

- Enable
- Disable
- Static
- Hover
- Focus
- Active

> Quando um componente não tem um destes estados, ele **não deve ser desenvolvido**.

# Como iniciar

1. Instale as dependências
`npm install` ou `yarn`

2. Fica observando alterações no projeto e recria o build do projeto em tempo de desenvolvimento
`npm run watch` ou `yarn watch`

    - Quando você deseja especificar um tema, é necessário adicionar
    `-- --theme <nomedotema>`

    **Exemplo**: `npm run watch -- --theme green`
    
    **Nome do tema**: é o sufixo relacionado ao arquivo `po-theme-<sufixo>.css`, localizado em `src/app/css/themes`;

3. Inicia o servidor (http-server) para testar o projeto
`npm run dev` ou `yarn dev`

    - Utilizando o `npm run watch` e o `npm run dev`, a cada alteração, apenas dê o refresh na página para visualizar a mesma;


Outros scripts:
* Faz o build do projeto
`npm run build` ou `yarn build`
    * Também é possível informar um tema específico adicionando `-- --theme <nomedotema>`

# Contribuição

Siga as `convenções de nomenclatura` abaixo:

O objetivo principal é continuar envolvendo os componentes, tornando-os mais simples de usar em qualquer projeto. O desenvolvimento do CDN 
PO Core é aberto para todos os desenvolvedores da Portinari, e agradecemos aos desenvolvedores da Portinari que contribuem com melhorias e 
correções de erros.

Leia abaixo para saber como você pode participar na melhoria do CDN PO Core.

### Steps

1. Crie um template HTML com o nome do componente em `src/css/components`
>2. Crie um link em `index.html` para redirecionar para o preview do componente
3. Crie uma pasta com o nome do componente em `src/css`
4. Crie um arquivo com o nome do componente e o sufixo `-map.css`
5. Crie uma `const` para referenciar o componente em `main.js`
6. Crie uma pasta `css` dentro da pasta que você criou com o nome do componente
7. Crie um arquivo `css` com o nome do componente
8. Execute a tarefa `gulp inject` para injetar o `<link href="dist/styles.css" />` localmente
9. Quando fazer o Pull Request, por favor rode a tarefa `gulp remove-inject` para referenciar o CDN styles

### Exemplo de contribuição

Nós queremos criar o componente `po-menu`.
1. O nome do arquivo deve ser: `src/templates/menu.html`
2. `<a class="col-12 po-link" href="@PATH/src/templates/menu.html">po-Menu</a>`
3. O nome da pasta deve ser:`src/css/menu`
4. O nome do arquivo deve ser: `src/css/menu/menu-map.css`
5. Criar uma constante dentro do arquivo `main.js`: `const menu = require('./src/css/menu/menu-map.css');`
6. O nome da pasta deve ser: `src/css/menu/css`
7. O nome do arquivo deve ser: `src/css/menu/css/menu.css`

### Dica para contribuir

* Dentro do arquivo `[<component>]-map.css` você deve usar `@import` dos arquivos CSS.
  * Exemplo: `@import 'css/menu.css'`

# Convenções de nomenclatura

### Utilitários

Classes que podem ser aplicadas para os componentes e outros elementos.

| Sintaxe                      | Exemplo                |
| -----------------------------|------------------------|
| `.po-u-[<utility>]`         | `.po-u-margin-top-10` |

### Componentes

| Sintax                                        | Exemplo                    |
| ----------------------------------------------|----------------------------|
| `.po-[<component>]`                          | `.po-menu`                |
| `.po-[<component>][-descendent]`             | `.po-menu-header`         |
| `.po-[<component>][-descendent][--modifier]` | `.po-menu-header--primary`|
| `.po-[<component>].is[-state]`               | `.po-menu.is-disable`     |

### Assets

Instalar [SVGO](https://github.com/svg/svgo) para otimizar arquivos SVG.

`$ [sudo] npm install -g svgo`

> **Arquivos SVG precisam ser otimizados antes de serem adicionados ao projeto**
