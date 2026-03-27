---
name: po-style-watch-css-integration
description: Integrar po-style com po-angular usando watch:css para desenvolvimento em tempo real, refletindo mudancas de CSS sem rebuild manual.
---

# Integrar po-style com po-angular usando watch:css

## Quando usar

Sempre que precisar testar ou demonstrar mudancas de CSS do po-style refletidas em tempo real no po-angular. Essencial para:
- Testar features que envolvem mudancas de CSS no po-style
- Demonstrar comportamento visual de componentes com estilos modificados da branch
- Desenvolver estilos no po-style e ver resultado imediato no po-angular

## Pre-requisitos

- Repos `po-style` e `po-angular` clonados na mesma pasta raiz (ex: `/home/ubuntu/repos/`)
- `npm install` executado em ambos os repos
- Estar na branch correta em ambos os repos

## Setup

### 1. Iniciar watch:css no po-style

Em um terminal dedicado (pode ser background), dentro do po-style:

```bash
cd /home/ubuntu/repos/po-style
npm run watch:css
```

Aguardar ate aparecer a mensagem:
```
ATENCAO: A TAREFA DE WATCH FOI INICIADA!
```

Isso indica que o gulp esta monitorando `src/css/` e recompilando para `dist/style/css/`.

### 2. Atualizar angular.json do po-angular

Alterar o array `styles` do projeto `app` no `angular.json`:

**DE (npm - padrao):**
```json
"styles": [
  "./node_modules/@po-ui/style/css/po-theme-default.min.css",
  "projects/app/src/styles.css"
]
```

**PARA (po-style local via watch:css):**
```json
"styles": [
  "../po-style/dist/style/css/po-theme-default.min.css",
  "projects/app/src/styles.css"
]
```

O caminho `../po-style/` assume ambos os repos na mesma pasta raiz. Ajustar se necessario.

### 3. Iniciar ng serve no po-angular

```bash
cd /home/ubuntu/repos/po-angular
npx ng serve app --port 4200 --host 0.0.0.0 --open=false
```

### 4. Verificar funcionamento

- Acessar `http://localhost:4200`
- Alteracoes em `.css` dentro de `po-style/src/css/` sao detectadas pelo watch:css
- watch:css recompila automaticamente para `dist/`
- ng serve detecta a mudanca e faz hot-reload no navegador

### 5. Ao finalizar - Reverter angular.json

Reverter o `angular.json` para o caminho original do npm:

```json
"styles": [
  "./node_modules/@po-ui/style/css/po-theme-default.min.css",
  "projects/app/src/styles.css"
]
```

## Troubleshooting

| Problema | Solucao |
|----------|---------|
| watch:css nao inicia | Verificar se `npm install` foi executado no po-style |
| Estilos nao refletem no browser | Verificar caminho no angular.json e reiniciar ng serve |
| Erro de arquivo nao encontrado no ng serve | Verificar se watch:css ja gerou arquivos em `dist/style/css/` |
| watch:css demora para iniciar | Aguardar 30+ segundos para inicializacao do gulp |

## Estrutura de shells recomendada

- **Shell 1 (watchcss):** `npm run watch:css` no po-style (background)
- **Shell 2 (serve):** `npx ng serve app` no po-angular (background)
- **Shell 3 (setup):** Shell livre para comandos auxiliares
