describe('PO Button Basic Sample', () => {
  beforeEach(() => {
    cy.visit('/button/basic');
  });

  it('deve renderizar o botão com o label "PO Button"', () => {
    cy.get('po-button').should('exist');
    cy.get('po-button button.po-button').should('be.visible');
    cy.get('po-button .po-button-label').should('contain.text', 'PO Button');
  });

  it('deve exibir um alerta ao clicar no botão', () => {
    const stub = cy.stub();
    cy.on('window:alert', stub);

    cy.get('po-button button.po-button')
      .click()
      .then(() => {
        expect(stub).to.have.been.calledWith('Po Button!');
      });
  });

  it('deve possuir o atributo p-kind padrão secondary', () => {
    cy.get('po-button').should('have.attr', 'p-kind', 'secondary');
  });

  it('não deve estar desabilitado', () => {
    cy.get('po-button button.po-button').should('not.be.disabled');
  });

  it('deve ter a classe po-button no elemento button', () => {
    cy.get('po-button button').should('have.class', 'po-button');
  });
});
