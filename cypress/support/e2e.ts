// Arquivo de suporte para testes E2E com Cypress
// Importações e comandos customizados podem ser adicionados aqui

Cypress.on('uncaught:exception', () => {
  // Previne falhas de teste por exceções não tratadas da aplicação
  return false;
});
