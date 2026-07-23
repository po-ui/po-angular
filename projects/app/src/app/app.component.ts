import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false
})
export class AppComponent {
  // Valores para teste de formatação ABL
  // Cenário: FORMAT ">9,99,99,99" com valor 5002.9234 → esperado: "50,02,92,34" (european)
  f01 = 5002.9234;

  // Cenário: FORMAT ">>>,>>>,>>9.99" com valor 4567.888888888 → esperado: "4.567,89" (european)
  f02 = 4567.888888888;

  // Cenário: FORMAT ">>>>>>>>9.99" com valor 4567.8 → esperado: "4567,80" (european)
  f04 = 4567.8;

  // Cenário: FORMAT "->>,>,>>>,>>9" com valor 4567.8 → esperado: "4.568" (european, arredondado)
  f05 = 4567.8;

  // Cenário: FORMAT "99,999,9,99.9999" com valor 4567.8 → esperado: "00,004,5,67.8000" (european)
  f06 = 4567.8;

  // Cenário principal da demanda: valor = 1, máscara = "999.9" → esperado: "000.1"
  valorSimples = 1;

  // Valores para demonstrar limitação de zeros à esquerda
  valorPequeno = 5;        // Com máscara 999.9 esperado: "000.5"
  valorMedio = 42;         // Com máscara 999.9 esperado: "004.2"
  valorGrande = 1234;      // Com máscara 999.9 esperado: "123.4"
}
