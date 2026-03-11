describe('PO Button Social Network Sample', () => {
  beforeEach(() => {
    cy.visit('/button/social-network');
  });

  it('deve renderizar o widget de Friend Request', () => {
    cy.get('po-widget').should('exist');
    cy.get('po-widget').should('contain.text', 'Friend Request');
  });

  it('deve exibir o primeiro amigo (Mr. Dev PO)', () => {
    cy.get('sample-po-button-social-network').should('contain.text', 'Mr. Dev PO');
    cy.get('sample-po-button-social-network').should('contain.text', '7 mutual friends');
    cy.get('sample-po-button-social-network').should('contain.text', 'Mountain View, CA');
  });

  it('deve renderizar os três botões de ação', () => {
    cy.get('sample-po-button-social-network po-button').should('have.length', 3);
    cy.get('sample-po-button-social-network po-button')
      .eq(0)
      .find('.po-button-label')
      .should('contain.text', 'Confirm');
    cy.get('sample-po-button-social-network po-button').eq(1).find('.po-button-label').should('contain.text', 'Ignore');
    cy.get('sample-po-button-social-network po-button').eq(2).find('.po-button-label').should('contain.text', 'Block');
  });

  it('deve avançar para o próximo amigo ao clicar em Confirm', () => {
    cy.get('sample-po-button-social-network po-button').eq(0).find('button.po-button').click();

    // Verifica notificação de sucesso
    cy.get('po-toaster').should('contain.text', 'User added successfully!');

    // Verifica que o segundo amigo é exibido
    cy.get('sample-po-button-social-network').should('contain.text', 'Mr. AI PO');
    cy.get('sample-po-button-social-network').should('contain.text', '99+ mutual friends');
    cy.get('sample-po-button-social-network').should('contain.text', 'New York City, NY');
  });

  it('deve avançar para o próximo amigo ao clicar em Ignore', () => {
    cy.get('sample-po-button-social-network po-button').eq(1).find('button.po-button').click();

    // Verifica notificação de warning
    cy.get('po-toaster').should('contain.text', 'User ignored successfully!');

    // Verifica que o segundo amigo é exibido
    cy.get('sample-po-button-social-network').should('contain.text', 'Mr. AI PO');
  });

  it('deve avançar para o próximo amigo ao clicar em Block', () => {
    cy.get('sample-po-button-social-network po-button').eq(2).find('button.po-button').click();

    // Verifica notificação de informação
    cy.get('po-toaster').should('contain.text', 'User blocked successfully!');

    // Verifica que o segundo amigo é exibido
    cy.get('sample-po-button-social-network').should('contain.text', 'Mr. AI PO');
  });

  it('deve exibir mensagem final após interagir com todos os amigos', () => {
    // Primeiro amigo - Confirm
    cy.get('sample-po-button-social-network po-button').eq(0).find('button.po-button').click();
    cy.get('sample-po-button-social-network').should('contain.text', 'Mr. AI PO');

    // Segundo amigo - Ignore
    cy.get('sample-po-button-social-network po-button').eq(1).find('button.po-button').click();
    cy.get('sample-po-button-social-network').should('contain.text', 'Mr. UX PO');

    // Terceiro amigo - Block
    cy.get('sample-po-button-social-network po-button').eq(2).find('button.po-button').click();

    // Verifica mensagem final
    cy.get('sample-po-button-social-network').should('contain.text', 'Congratulations TOTVS, no more requests!');
  });

  it('não deve exibir botões após interagir com todos os amigos', () => {
    // Interage com os três amigos
    cy.get('sample-po-button-social-network po-button').eq(0).find('button.po-button').click();
    cy.get('sample-po-button-social-network po-button').eq(0).find('button.po-button').click();
    cy.get('sample-po-button-social-network po-button').eq(0).find('button.po-button').click();

    // Verifica que não há mais botões de ação
    cy.get('sample-po-button-social-network po-button').should('have.length', 0);
  });

  it('deve exibir o avatar do usuário', () => {
    cy.get('po-avatar').should('exist');
  });
});
