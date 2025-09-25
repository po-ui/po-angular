/**
 * @docsPrivate
 *
 * @description
 *
 * Define o tamanho padrão utilizado em componentes interativos. Este enum também é usado pelo serviço de tema para
 * definir a preferência global de tamanho dos componentes. Por padrão, os componentes utilizam o tamanho `medium` por
 * ser mais acessível (conforme diretrizes WCAG nível AAA).
 *
 * > O tamanho `small` está disponível apenas em contextos com acessibilidade AA.
 */
export enum PoFieldSize {
  Small = 'small',
  Medium = 'medium'
}
