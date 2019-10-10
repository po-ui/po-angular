# Po Theme Cli

Ferramenta que vai ajudar na criação de temas customizados para o [Portinari UI](https://portinari.io/).

## Instalação

Faça a instalação global da ferramenta:

```
npm install -g @portinari/theme-cli
```

Você pode ver as opções disponíveis através do comando:

```
po-theme -help
```

## Iniciando um projeto para o novo tema customizado

Navegue até o diretório que você deseja e execute o comando:

```
po-theme new my-custom-portinari-theme
```

Isso irá gerar um novo diretório com o nome `my-custom-portinari-theme` e com os arquivos iniciais
para seu tema.

Acesse o arquivo `src/po-theme-custom.css` e faça as customizações necessárias.

> Para customização das fontes você deve colocar seus arquivos na pasta `src/assets/fonts`.

## Gerando build do tema customizado

Para fazer o build e preparar o tema para publicação, você deve executar o seguinte comando dentro da
pasta do projeto:

```
po-theme build
```

> Caso queira atribuir um nome ao arquivo a ser gerado, deve-se utilizar o parâmetro `--name` informando o nome desejado.

> Se você estiver customizando as fontes do tema, você deve usar o parâmetro `--fonts`.

Após a execução do comando de *build*, irá ser gerado uma pasta chamada `dist` dentro do diretório
do seu projeto.

> Você pode modificar seu `package.json` adicionando informações sobre o seu pacote, como name, version,
entre outras informações importantes.

### Publicando o novo tema customizado

Acesse a pasta `dist` e execute o seguinte comando:

```
npm publish
```

## Utilizando o tema customizado

Existem 3 formas de você usar o tema customizado após a publicação.

Configure o arquivo `angular.json` da aplicação conforme for mais conveniente as suas necessidade.

### 1 - Usar o arquivo "compilado" com todo o CSS.

``` json
"styles": [
  "node_modules/my-custom-portinari-theme/css/po-theme-custom.min.css",
  "src/styles.css"
],
```

**Prós:** Modo mais simples de usar e atende aos browser suportados.

**Contras:** O tema customizado deve ser sempre atualizado conforme o tema padrão for publicado, pois
pode ficar sem os novos estilos publicados.

### 2 - Usar o arquivo de variáveis do tema customizado + arquivo CSS do tema padrão

``` json
"styles": [
  "node_modules/my-custom-portinari-theme/css/po-theme-custom-variables.min.css",
  "node_modules/@portinari/style/css/po-theme-core.min.css",
  "src/styles.css"
],
```

> Atenção a ordem dos arquivos

**Prós:** Permite que o usuário do tema customizado aplique customizações em cima do tema customizado
na aplicação final.

**Contras:** O tema customizado deve ser sempre atualizado conforme o tema padrão for publicado e pode
ter incompatibilidade com *browsers* antigos que não dão suporte a variáveis no CSS.

### 3 - Usar o arquivo de variáveis do tema padrão + variáveis do tema customizado + arquivo CSS do tema padrão

``` json
"styles": [
  "node_modules/@portinari/style/css/po-theme-default-variables.min.css",
  "node_modules/my-custom-portinari-theme/css/po-theme-custom-variables.min.css",
  "node_modules/@portinari/style/css/po-theme-core.min.css",
  "src/styles.css"
],
```

> Atenção a ordem dos arquivos

**Prós:** Não corre risco de perder novos estilos, permite que o usuário do tema customizado aplique
customizações em cima do tema customizado na aplicação final.

**Contras:** Pode ter incompatibilidade com *browsers* antigos que não dão suporte a variáveis no CSS.

> Atenção: Para saber quais browsers dão suporte a variáveis você pode consultar a ferramenta 
[Can I use][can-i-use].

[can-i-use]: https://caniuse.com/#search=CSS%20Variables
