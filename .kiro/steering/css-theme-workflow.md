---
inclusion: fileMatch
fileMatchPattern: ["**/*.css", "**/*.scss", "angular.json", "projects/**/styles/**/*.ts"]
name: css-theme-workflow
description: Use ao alterar temas CSS, integrar po-style localmente ou sincronizar variáveis entre po-style e po-theme-totvs.
---

# Workflow de CSS, Temas e Integração po-style

## Desenvolvimento CSS em tempo real com po-style e po-angular

Quando alterações de CSS forem testadas no `po-angular`, garantir que o repositório `po-style` seja consumido localmente, não pela versão publicada no npm.

Procedimento:

1. Manter `po-style` e `po-angular` no mesmo diretório pai, quando possível.
2. No `po-style`, executar:

```bash
npm run watch:css
```

3. Aguardar a mensagem de inicialização do watch.
4. No `po-angular`, ajustar o `angular.json` para usar o CSS compilado localmente:

```json
"../po-style/dist/style/css/po-theme-default.min.css"
```

5. Executar o app Angular:

```bash
npx ng serve app --port 4200 --host 0.0.0.0 --open=false
```

## Espelhamento entre po-style e po-theme-totvs

O arquivo `src/po-theme-custom.css` do repositório `totvs/po-theme-totvs` deve espelhar o arquivo `src/css/themes/po-theme-default.css` do repositório `po-ui/po-style`.

Regras:

- Alterações em `po-theme-default.css` devem ser replicadas em `po-theme-custom.css`.
- Alterações em `po-theme-custom.css` devem ser avaliadas para replicação em `po-theme-default.css`.
- A sincronização vale para o arquivo inteiro, não apenas para classes ou componentes específicos.
- Alterações em variáveis CSS de componentes, como `po-header` e `po-button`, devem ser mantidas consistentes entre os repositórios.
