describe('PO Button Labs Sample', () => {
  beforeEach(() => {
    cy.visit('/button/labs');
  });

  describe('Estado inicial', () => {
    it('deve renderizar o botão principal', () => {
      cy.get('sample-po-button-labs po-button').first().find('button.po-button').should('be.visible');
    });

    it('deve iniciar com kind secondary', () => {
      cy.get('sample-po-button-labs po-button').first().should('have.attr', 'p-kind', 'secondary');
    });

    it('deve renderizar o formulário de configuração', () => {
      cy.get('sample-po-button-labs form').should('exist');
    });

    it('deve exibir o campo de input para Label', () => {
      cy.get('sample-po-button-labs po-input').should('exist');
    });

    it('deve exibir o checkbox group de Properties', () => {
      cy.get('sample-po-button-labs po-checkbox-group').should('exist');
    });

    it('deve exibir os radio groups de configuração', () => {
      cy.get('sample-po-button-labs po-radio-group').should('have.length', 4);
    });

    it('deve exibir o botão Sample Restore', () => {
      cy.get('sample-po-button-labs po-button')
        .last()
        .find('.po-button-label')
        .should('contain.text', 'Sample Restore');
    });
  });

  describe('Alteração de Label', () => {
    it('deve atualizar o label do botão ao digitar no campo Label', () => {
      cy.get('sample-po-button-labs po-input input').clear().type('Meu Botão');
      cy.get('sample-po-button-labs po-button').first().find('.po-button-label').should('contain.text', 'Meu Botão');
    });
  });

  describe('Propriedade Disabled', () => {
    it('deve desabilitar o botão ao marcar a opção Disabled', () => {
      cy.get('sample-po-button-labs po-checkbox-group').contains('Disabled').click();
      cy.get('sample-po-button-labs po-button').first().find('button.po-button').should('be.disabled');
    });
  });

  describe('Propriedade Loading', () => {
    it('deve exibir o ícone de loading ao marcar a opção Loading', () => {
      cy.get('sample-po-button-labs po-checkbox-group').contains('Loading').click();
      cy.get('sample-po-button-labs po-button').first().find('button.po-button').should('be.disabled');
      cy.get('sample-po-button-labs po-button').first().find('.po-button-loading-icon').should('exist');
    });
  });

  describe('Propriedade Danger', () => {
    it('deve aplicar o atributo danger ao marcar a opção Danger', () => {
      cy.get('sample-po-button-labs po-checkbox-group').contains('Danger').click();
      cy.get('sample-po-button-labs po-button').first().should('have.attr', 'p-danger', 'true');
    });
  });

  describe('Alteração de Icon', () => {
    it('deve aplicar o ícone an an-newspaper ao botão', () => {
      cy.get('sample-po-button-labs po-radio-group[name="icon"]').contains('an an-newspaper').click();
      cy.get('sample-po-button-labs po-button').first().find('po-icon.po-button-icon').should('exist');
      cy.get('sample-po-button-labs po-button').first().find('po-icon i.an-newspaper').should('exist');
    });

    it('deve aplicar o ícone an an-calendar-dots ao botão', () => {
      cy.get('sample-po-button-labs po-radio-group[name="icon"]').contains('an an-calendar-dots').click();
      cy.get('sample-po-button-labs po-button').first().find('po-icon i.an-calendar-dots').should('exist');
    });

    it('deve aplicar o ícone an an-user ao botão', () => {
      cy.get('sample-po-button-labs po-radio-group[name="icon"]').contains('an an-user').click();
      cy.get('sample-po-button-labs po-button').first().find('po-icon i.an-user').should('exist');
    });

    it('deve aplicar o ícone fa fa-podcast ao botão', () => {
      cy.get('sample-po-button-labs po-radio-group[name="icon"]').contains('fa fa-podcast').click();
      cy.get('sample-po-button-labs po-button').first().find('po-icon i.fa-podcast').should('exist');
    });
  });

  describe('Alteração de Kind', () => {
    it('deve alterar o kind para primary', () => {
      cy.get('sample-po-button-labs po-radio-group[name="kind"]').contains('primary').click();
      cy.get('sample-po-button-labs po-button').first().should('have.attr', 'p-kind', 'primary');
    });

    it('deve alterar o kind para tertiary', () => {
      cy.get('sample-po-button-labs po-radio-group[name="kind"]').contains('tertiary').click();
      cy.get('sample-po-button-labs po-button').first().should('have.attr', 'p-kind', 'tertiary');
    });
  });

  describe('Alteração de Type', () => {
    it('deve alterar o type para submit', () => {
      cy.get('sample-po-button-labs po-radio-group[name="type"]').contains('submit').click();
      cy.get('sample-po-button-labs po-button').first().find('button.po-button').should('have.attr', 'type', 'submit');
    });

    it('deve alterar o type para reset', () => {
      cy.get('sample-po-button-labs po-radio-group[name="type"]').contains('reset').click();
      cy.get('sample-po-button-labs po-button').first().find('button.po-button').should('have.attr', 'type', 'reset');
    });
  });

  describe('Alteração de Size', () => {
    it('deve alterar o tamanho para large', () => {
      cy.get('sample-po-button-labs po-radio-group[name="size"]').contains('large').click();
      cy.get('sample-po-button-labs po-button')
        .first()
        .find('button.po-button')
        .should('have.class', 'po-button-large');
    });

    it('deve alterar o tamanho de large para medium', () => {
      // Muda para large primeiro
      cy.get('sample-po-button-labs po-radio-group[name="size"]').contains('large').click();
      cy.get('sample-po-button-labs po-button')
        .first()
        .find('button.po-button')
        .should('have.class', 'po-button-large');

      // Volta para medium
      cy.get('sample-po-button-labs po-radio-group[name="size"]').contains('medium').click();
      cy.get('sample-po-button-labs po-button')
        .first()
        .find('button.po-button')
        .should('not.have.class', 'po-button-large');
    });
  });

  describe('Interação Danger e Kind Tertiary', () => {
    it('deve desabilitar a opção Danger ao selecionar kind tertiary', () => {
      cy.get('sample-po-button-labs po-radio-group[name="kind"]').contains('tertiary').click();
      // Quando kind é tertiary, a opção Danger fica desabilitada
      cy.get('sample-po-button-labs po-checkbox-group po-checkbox')
        .last()
        .find('span.po-checkbox')
        .should('have.attr', 'aria-disabled', 'true');
    });

    it('deve desabilitar a opção tertiary ao marcar Danger', () => {
      cy.get('sample-po-button-labs po-checkbox-group').contains('Danger').click();
      cy.get('sample-po-button-labs po-radio-group[name="kind"]')
        .find('po-radio')
        .last()
        .find('input')
        .should('be.disabled');
    });
  });

  describe('Botão Click', () => {
    it('deve exibir um diálogo ao clicar no botão principal', () => {
      cy.get('sample-po-button-labs po-button').first().find('button.po-button').click();
      cy.get('po-modal').should('be.visible');
      cy.get('po-modal').should('contain.text', 'Hello PO World!!!');
    });
  });

  describe('Restore', () => {
    it('deve restaurar o estado inicial completo ao clicar em Sample Restore', () => {
      // Altera várias propriedades
      cy.get('sample-po-button-labs po-input input').clear().type('Teste');
      cy.get('sample-po-button-labs po-radio-group[name="kind"]').contains('primary').click();
      cy.get('sample-po-button-labs po-radio-group[name="size"]').contains('large').click();
      cy.get('sample-po-button-labs po-radio-group[name="icon"]').contains('an an-user').click();
      cy.get('sample-po-button-labs po-checkbox-group').contains('Disabled').click();

      // Clica em restaurar
      cy.get('sample-po-button-labs po-button').last().find('button.po-button').click();

      // Verifica que tudo voltou ao estado inicial
      cy.get('sample-po-button-labs po-button').first().should('have.attr', 'p-kind', 'secondary');
      cy.get('sample-po-button-labs po-button').first().find('button.po-button').should('not.be.disabled');
      cy.get('sample-po-button-labs po-button')
        .first()
        .find('button.po-button')
        .should('not.have.class', 'po-button-large');
      cy.get('sample-po-button-labs po-button').first().find('po-icon').should('not.exist');
    });
  });
});
