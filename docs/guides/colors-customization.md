[comment]: # (@label Customizando cores do tema padrão)
[comment]: # (@link guides/colors-customization)

A partir da versão 1.9.0, o **Portinari UI** permite que você customize suas cores padrões de maneira fácil, você pode alterar as cores de apenas um componente ou de todos de uma única vez, para isso você vai precisar apenas alterar 
os valores das variáveis usadas no CSS do tema padrão.

### Como o tema do Portinari UI funciona

Se você já tem uma aplicação que está usando o tema padrão do Portinari UI, você deve ter seu arquivo
`angular.json` configurado da seguinte maneira.

``` json
"styles": [
  // Arquivo com o tema do Portinari UI com as variáveis "compiladas"
  "node_modules/@portinari/style/css/po-theme-default.min.css", 
  "src/styles.css"
],
```

Essa configuração usa o arquivo CSS minificado e *"compilado"*, ou seja, as variáveis do CSS foram
substituídas pelos valores hexadecimais correspondentes das cores usadas (entre outras coisas). Na prática 
e resumidamente falando, o que aconteceu com esse arquivo foi o seguinte:

``` css
/* Isso "compilando" ... */
.po-button {
  background-color: var(--color-button-background-color);
  color: var(--color-button-color);
}

/* ... vira isso. */
.po-button{background-color: transparent;color: #8241a4;}
```

### Configurando sua aplicação para permitir customização das cores

Para que seja possível fazer a customização das cores, o *package* `@portinari/style` passou a disponibilizar
os arquivos que contém as variáveis e o arquivo de estilo sem a *"compilação"* das variáveis, para isso
você precisa carregar esses novos arquivos em seu projeto ao invés do arquivo que não permite a modificação
das cores.

``` json
"styles": [
  // Arquivo de variáveis (tema padrão)
  "node_modules/@portinari/style/css/po-theme-default-variables.min.css",
  // Arquivo com os estilos sem as variáveis "compiladas"
  "node_modules/@portinari/style/css/po-theme-core.min.css",
  "src/styles.css"
],
```

> Só isso não vai fazer diferença no seu projeto, as cores padrões ainda serão mantidas.

### Customizando as cores no seu projeto

Crie um novo arquivo CSS para o seu projeto Angular ou altere um arquivo já existente adicionando as seguintes
linhas:

``` css
:root {
  --color-button-color: white;
  --color-button-background-color: black;
}
```

Só com isso já conseguimos dar uma nova cara para os nossos botões.

![Componente Button com a cor preta.][button-black]

Caso você queira customizar todas as cores é possível usar algumas das variáveis globais:

``` css
:root {
  --color-primary: red;
  --color-secondary: green;
  --color-tertiary: blue;
}
```

![Exemplo dos componentes com as cores customizadas. Um botão azul, o componentes Tabs está com título
verde e o scroll da página na cor vermelha.][components-custom-colors]

Bom com isso você já consegue alterar todas as cores dos componentes e templates da sua aplicação que
usam o Portinari UI.

> Para saber quais as variáveis que você pode alterar, basta verificar o arquivo 
`po-theme-default-variables.css` na pasta `node_modules/@portinari/style/css`, você vai encontrar
uma cópia exata do arquivo com todas as variáveis usadas pelo tema padrão.

> Atenção: Para saber quais browsers dão suporte a variáveis você pode consultar a ferramenta 
[Can I use][can-i-use].

[button-black]: ./assets/graphics/theme/button-black.png
[components-custom-colors]: ./assets/graphics/theme/components-custom-colors.png
[can-i-use]: https://caniuse.com/#search=CSS%20Variables
