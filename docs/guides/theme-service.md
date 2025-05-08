[comment]: # (@label Customização de Temas usando o serviço PO-UI)
[comment]: # (@link guides/theme-service)

A partir da versão 19.X.X, o PO-UI oferece um serviço completo para criação e gestão de temas personalizados, permitindo controle total sobre cores, tipografia, acessibilidade e comportamentos específicos de componente.

Principais Recursos:

<div class="po-row" style="margin: 20px 0;">
  <div class="po-lg-2 po-md-5 po-sm-12" style="padding: 10px;">
    <div style="text-align: center;">
      <po-icon p-icon="an an-palette" style="font-size: 24px;"></po-icon>
      <p>Paletas de cores</p>
    </div>
  </div>
  <div class="po-lg-2 po-md-5 po-sm-12" style="padding: 10px;">
    <div style="text-align: center;">
      <div>
        <po-icon p-icon="an an-sun" style="font-size: 24px;"></po-icon>
        <po-icon p-icon="an an-moon" style="font-size: 24px;"></po-icon>
      </div>
      <p>Temas light/dark</p>
    </div>
  </div>
  <div class="po-lg-2 po-md-5 po-sm-12" style="padding: 10px;">
    <div style="text-align: center;">
      <po-icon p-icon="an an-wheelchair-motion" style="font-size: 24px;"></po-icon>
      <p>Acessibilidade (AA/AAA)</p>
    </div>
  </div>
  <div class="po-lg-2 po-md-5 po-sm-12" style="padding: 10px;">
    <div style="text-align: center;">
      <po-icon p-icon="an an-wrench" style="font-size: 24px;"></po-icon>
      <p>Sobrescrita de estilos</p>
    </div>
  </div>
  <div class="po-lg-2 po-md-5 po-sm-12" style="padding: 10px;">
    <div style="text-align: center;">
      <po-icon p-icon="an an-lightning" style="font-size: 24px;"></po-icon>
      <p>Aplicação dinâmica</p>
    </div>
  </div>
</div>

### Conteúdo

- [Introdução à Customização de Temas no PO UI](guides/theme-service#introduction)
- [Por Que Usar o PoThemeService?](guides/theme-service#whyUse)
- [Configuração Inicial](guides/theme-service#config)
    - [Importação do Módulo](guides/theme-service#configModule)
    - [Estilo PO-UI](guides/theme-service#configStyle)
    - [Injeção do Serviço](guides/theme-service#configService)
- [Como Utilizar o Serviço de Tema](guides/theme-service#howToUse)
    - [Estrutura Básica](guides/theme-service#howToUseBasic)
    - [Exemplo Completo](guides/theme-service#howToUseComplete)
- [Aplicando o Tema](guides/theme-service#applyTheme)
    - [Aplicação Inicial](guides/theme-service#applyThemeInitial)
    - [Aplicação Dinâmica](guides/theme-service#applyThemeDynamic)
- [Técnicas Avançadas](guides/theme-service#advanced)
    - [Sobrescrita de Variáveis](guides/theme-service#advancedOverride)
    - [Customização por Componente](guides/theme-service#advancedPerComponent)
    - [Customização por Componente](guides/theme-service#advancedReset)
- [Exemplo Completo no Stackblitz](guides/theme-service#sampleStackblitz)

<a id="introduction"></a>
### Introdução à Customização de Temas no PO UI

O PO UI oferece um sistema robusto e flexível para personalização visual de componentes, permitindo que desenvolvedores e designers criem experiências únicas e alinhadas às necessidades específicas de cada projeto. A customização vai além da simples alteração de cores - é um sistema completo que abrange desde variáveis CSS globais até a criação de temas dinâmicos com suporte a light/dark mode, acessibilidade avançada e controle granular sobre cada componente.

<a id="whyUse"></a>
### Por Que Usar o PoThemeService?

O serviço de temas do PO UI (PoThemeService) é o coração do sistema de customização, oferecendo:

<details>
<summary><strong>Aplicação Dinâmica de Temas</strong></summary>

- Alterações em tempo real sem recarregar a aplicação
- Transições suaves entre temas light/dark

</details>

<details>
<summary><strong>Gestão Centralizada</strong></summary>

- Criação e armazenamento de múltiplos temas
- Combinação de temas globais e customizações locais

</details>

<details>
<summary><strong>Integração com Estado da Aplicação</strong></summary>

- Persistência de preferências (localStorage)
- Sincronização com configurações do usuário

</details>

<details>
<summary><strong>Controle de Acessibilidade</strong></summary>

- Ativação de níveis AA/AAA conforme requisitos
- Ajustes automáticos de contrastes

</details>

<details>
<summary><strong>Sobrescrita Flexível</strong></summary>

- Hierarquia clara: Tema > Variáveis Globais > Estilos Locais

</details>

<a id="config"></a>
### Configuração Inicial

<a id="configModule"></a>
#### Importação do Módulo
```typescript
import { PoModule } from '@po-ui/ng-components';

@NgModule({
  imports: [
    PoThemeModule
  ]
})
export class AppModule { }
```

<a id="configStyle"></a>
#### Estilo PO-UI
Configurar o arquivo angular.json da seguinte maneira:
```json
"styles": [
  "node_modules/@po-ui/style/css/po-theme-default.min.css", 
  "src/styles.css"
]
```

<a id="configService"></a>
#### Injeção do Serviço
Injeção do Serviço no construtor do componente:
```typescript
import { PoThemeService } from '@po-ui/ng-components';

export class AppComponent {
  constructor(private poThemeService: PoThemeService) { }
}
```

<a id="howToUse"></a>
### Como Utilizar o Serviço de Tema
Criando um Tema Personalizado

<a id="howToUseBasic"></a>
#### Estrutura Básica
```typescript
const meuTema: PoTheme = {
  name: 'meu-tema',
  type: [
    {
      light: { /* Configurações tema claro para A11y AAA*/ },
      dark: { /* Configurações tema escuro para A11y AAA*/ },
      a11y: PoThemeA11yEnum.AAA
    },
    {
      light: { /* Configurações tema claro para A11y AA*/ },
      dark: { /* Configurações tema escuro para A11y AA*/ },
      a11y: PoThemeA11yEnum.AA
    }
  ],
  active: { type: PoThemeTypeEnum.light, a11y: PoThemeA11yEnum.AAA }
};
```

<a id="howToUseComplete"></a>
#### Exemplo Completo
```typescript
import { PoTheme, PoThemeTypeEnum } from '@po-ui/ng-components';

export const corporateTheme: PoTheme = {
  name: 'corporate',
  type: [
    {
      light: {
        color: {
          brand: {
            '01': { 
              base: '#2A5C8D',
              light: '#4D7BA5',
              dark: '#1D4364'
            },
            '02': { base: '#FF6B35' },
            '03': { base: '#00CC66' }
          },
          neutral: { /* Tons de cinza */ },
          feedback: { /* Cores de feedback */ }
        },
        onRoot: {
          '--font-family': "'Inter', sans-serif",
          '--border-radius': '6px'
        },
        perComponent: {
          'po-button': {
            '--padding': '0.75rem 1.5rem',
            '--font-weight': '600'
          }
        }
      },
      dark: { /* Configurações dark mode */ },
      a11y: PoThemeA11yEnum.AAA
    },
    {
      light: { /* Configurações tema claro para A11y AA*/ },
      dark: { /* Configurações tema escuro para A11y AA*/ },
      a11y: PoThemeA11yEnum.AA
    }
  ],
  active: { type: PoThemeTypeEnum.light, a11y: PoThemeA11yEnum.AAA }
};
```

<a id="applyTheme"></a>
### Aplicando o Tema

<a id="applyThemeInitial"></a>
#### Aplicação Inicial
```typescript
ngOnInit() {
  this.poTheme.setTheme(meuTema, PoThemeTypeEnum.light, PoThemeA11yEnum.AAA);
}
```

<a id="applyThemeDynamic"></a>
#### Aplicação Dinâmica
```typescript
// Alternar entre light/dark mode
toggleTheme() {
  const newType = this.currentTheme === PoThemeTypeEnum.light 
    ? PoThemeTypeEnum.dark 
    : PoThemeTypeEnum.light;
  
  this.poTheme.changeCurrentThemeType(newType);
}

// Alterar nível de acessibilidade
setAcessibilidade(nivel: PoThemeA11yEnum) {
  this.poTheme.setCurrentThemeA11y(nivel);
}
```

<a id="advanced"></a>
### Técnicas Avançadas

<a id="advancedOverride"></a>
#### Sobrescrita de Variáveis

```css
/* styles.scss */
:root.override-theme {
  --color-brand-01-base: #FF0000;
}
```

<a id="advancedPerComponent"></a>
#### Customização por Componente
```typescript
perComponent: {
  'po-input': {
    '--background': 'var(--color-neutral-light-00)',
    '--border-color': 'var(--color-neutral-mid-40)'
  }
}
```

<a id="advancedReset"></a>
#### Reset para Tema Padrão
```typescript
resetParaPadrao() {
  this.poTheme.resetBaseTheme();
}
```

<a id="sampleStackblitz"></a>
### Exemplo Completo no Stackblitz
<a href="https://stackblitz.com/edit/poui-theme-service" target="_blank" rel="noreferrer">
    <img src="https://developer.stackblitz.com/img/open_in_stackblitz.svg" alt="Open in StackBlitz">
</a>