// Interface para literais de tradução para os Pages Dinâmicos.
export interface PoPageDynamicLiterals {
  // Titulo retornado do metadados caso houver erro na requisição.
  errorRenderPage: string;

  // Mensagem exibida na notificação de erro na requisição dos metadados.
  notPossibleLoadMetadataPage: string;
}
