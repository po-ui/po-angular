# @po-ui/user-guide

Bundle standalone do `PoUserGuide` (versão vanilla JS), pronto para uso direto no navegador
via CDN, sem dependência de Angular.

Inclui:

- A classe pública `PoUserGuide` com a API mínima para criar tours guiados.
- O `driver.js` embutido no bundle (não precisa instalar separado).
- Sanitização de HTML via `DOMPurify` embutido.
- O CSS do `po-user-guide` do `@po-ui/style` empacotado em `dist/po-user-guide.css`.

## Uso via CDN

```html
<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="utf-8" />
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@po-ui/user-guide@latest/dist/po-user-guide.css" />
  </head>
  <body>
    <button id="hello">Olá</button>

    <script src="https://cdn.jsdelivr.net/npm/@po-ui/user-guide@latest/dist/po-user-guide.iife.js"></script>
    <script>
      PoUserGuide.create()
        .setSteps([
          { element: '#hello', title: 'Bem-vindo', content: 'Clique aqui para começar.' }
        ])
        .setOptions({ showProgress: true, allowClose: true })
        .start();
    </script>
  </body>
</html>
```

> **Atenção**: para que o tema PO UI funcione integralmente, inclua também o `po-theme-default.css`
> do `@po-ui/style`. O bundle traz apenas os estilos específicos do `po-user-guide`; tokens globais
> (cores, espaçamentos, fontes) vêm do tema.

## API mínima da entrega inicial

```ts
PoUserGuide.create()
  .setSteps(steps)        // array de PoUserGuideStep
  .setOptions(options)    // PoUserGuideOptions
  .start(startIndex?);    // inicia o tour

instance.next();
instance.previous();
instance.goTo(index);
instance.close();
instance.isActive();
```

## Build local

```bash
npm run build:user-guide
```

Saídas:

| Arquivo                          | Formato                        |
| -------------------------------- | ------------------------------ |
| `dist/po-user-guide.iife.js`     | IIFE, expõe global `PoUserGuide` |
| `dist/po-user-guide.esm.js`      | ESM                            |
| `dist/po-user-guide.umd.cjs`     | UMD/CommonJS                   |
| `dist/po-user-guide.css`         | CSS extraído (popover + driver) |
| `dist/po-user-guide.d.ts`        | Tipagens TypeScript            |
