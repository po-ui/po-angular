import { Injectable } from '@angular/core';

@Injectable()
export class PoDynamicFormRegisterService {
  getCity(state: number) {
    switch (state) {
      case 1: {
        return [
          { label: 'Palhoça', value: 5 },
          { label: 'Lages', value: 6 },
          { label: 'Balneário Camboriú', value: 7 },
          { label: 'Brusque', value: 8 }
        ];
      }
      case 2: {
        return [
          { label: 'São Paulo', value: 9 },
          { label: 'Guarulhos', value: 10 },
          { label: 'Campinas', value: 11 },
          { label: 'São Bernardo do Campo', value: 12 }
        ];
      }
      case 3: {
        return [
          { label: 'Rio de Janeiro', value: 13 },
          { label: 'São Gonçalo', value: 14 },
          { label: 'Duque de Caxias', value: 15 },
          { label: 'Nova Iguaçu', value: 16 }
        ];
      }
      case 4: {
        return [
          { label: 'Belo Horizonte', value: 17 },
          { label: 'Uberlândia', value: 18 },
          { label: 'Contagem', value: 19 },
          { label: 'Juiz de Fora', value: 20 }
        ];
      }
    }
    return [];
  }

  getUserDocument(value) {
    const cpfField = { property: 'cpf', visible: true };
    const cnpjField = { property: 'cnpj', visible: true };
    const document = value.isJuridicPerson ? cnpjField : cpfField;

    return {
      fields: [document]
    };
  }
}
