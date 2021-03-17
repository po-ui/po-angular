/**
 * Para usar o po-mask é preciso instanciar esta classe passando a máscara como
 * primeiro parâmetro, e no segundo parâmetro, deve se informado true, caso queira
 * que o model seja formatado ou false para o que o model seja limpo.
 */
export class PoMask {
  mask: string = '';
  formatModel: boolean = false;
  // controle de posição
  initialPosition: number = 0;
  finalPosition: number = 0;

  pattern: string = '';
  get getPattern(): string {
    return this.pattern;
  }

  valueToInput: string;
  get getValueToInput(): string {
    return this.valueToInput;
  }
  set setValueToInput(value: string) {
    this.valueToInput = value;
  }

  valueToModel: string;
  get getValueToModel(): string {
    return this.valueToModel;
  }
  set setValueToModel(value: string) {
    this.valueToModel = value;
  }

  formattingEnds: boolean;

  constructor(mask: string, formatModel: boolean) {
    this.mask = mask;
    this.formatModel = formatModel;
    this.pattern = this.getRegexFromMask(mask);
  }

  keyup($event: any) {
    if (this.mask) {
      const value = $event.target.value;
      // formata o valor quando for colado com control + v e reposiciona o cursor
      if ($event.keyCode === 17 || $event.keyCode === 91) {
        $event.target.value = this.controlFormatting(value);
        this.resetPositions($event);
      }

      $event.preventDefault();

      switch ($event.keyCode) {
        case 37: // seta esquerda
          if (this.initialPosition > 0) {
            this.initialPosition--;
          }
          this.setPositionNotShiftKey($event);
          this.setSelectionRange($event);
          break;

        case 39: // seta direita
          if (this.initialPosition < value.toString().length) {
            this.initialPosition++;
          }
          this.setPositionNotShiftKey($event);
          this.setSelectionRange($event);
          break;

        case 35: // end
          this.finalPosition = value.toString().length;
          if ($event.shiftKey) {
            this.setPositions($event);
          } else {
            this.initialPosition = this.finalPosition;
            this.setPositions($event);
          }
          break;

        case 36: // HOME
          if ($event.shiftKey) {
            this.finalPosition = this.initialPosition;
            this.initialPosition = 0;
            this.setPositions($event);
          } else {
            this.initialPosition = 0;
            this.finalPosition = 0;
            this.setPositions($event);
          }
          break;
      }
    }
  }

  setPositionNotShiftKey($event: any) {
    if (!$event.shiftKey) {
      this.finalPosition = this.initialPosition;
    }
  }

  setSelectionRange($event: any) {
    if (this.initialPosition > this.finalPosition) {
      $event.target.setSelectionRange(this.finalPosition, this.initialPosition);
    } else {
      $event.target.setSelectionRange(this.initialPosition, this.finalPosition);
    }
  }

  keydown($event: any) {
    if (this.mask) {
      let value: string = $event.target.value;
      if ($event.keyCode === 9) {
        return;
      }

      if (!$event.ctrlKey && !$event.metaKey) {
        $event.preventDefault();
      }

      // Não faz nada quando for digitado CTRL ou COMMAND e V
      // Já está sendo tratado no evento keyup
      if (
        $event.ctrlKey ||
        ($event.metaKey && $event.keyCode !== 86) ||
        ($event.keyCode >= 37 && $event.keyCode <= 40) ||
        $event.keyCode === 16 ||
        $event.keyCode === 9
      ) {
        return;
      }

      // Valida a tecla digitada
      if (this.isKeyValid($event.keyCode)) {
        if (this.finalPosition === null) {
          this.finalPosition = this.initialPosition;
        }
        this.revertPositions(this.initialPosition, this.finalPosition);

        switch ($event.keyCode) {
          case 8: // backspace
            this.getPosition($event);
            if (this.initialPosition < 0) {
              this.initialPosition = 0;
              this.setPositions($event);
            }
            if (this.initialPosition === this.finalPosition) {
              this.checkMaskBefore($event, -1);
              if (this.initialPosition !== 0) {
                value = value.slice(0, this.initialPosition - 1) + value.slice(this.finalPosition);
                value = this.controlFormatting(value);
                $event.target.value = value;
                this.changePosition($event, -1);
                this.checkMaskBefore($event, -1);
                this.setPositions($event);
                this.resetPositions($event);
              }
            } else {
              this.clearRangeSelection(value, $event, true);
            }
            this.setPositions($event);
            break;

          case 46: // delete
            this.getPosition($event);
            if (this.initialPosition === this.finalPosition) {
              this.checkMaskAfter($event, 1);
              value = value.slice(0, this.initialPosition) + value.slice(this.finalPosition + 1);
              value = this.controlFormatting(value);
              $event.target.value = value;
              this.setPositions($event);
              this.resetPositions($event);
            } else {
              this.clearRangeSelection(value, $event, false);
            }
            this.setPositions($event);
            break;

          default:
            // qualquer outra tecla válida
            this.getPosition($event);
            value = value.slice(0, this.initialPosition) + $event.key + value.slice(this.finalPosition);
            value = this.controlFormatting(value);
            $event.target.value = value;
            this.changePosition($event, 1);
            this.checkMaskBefore($event, 1);
            this.setPositions($event);
            this.resetPositions($event);
            this.setPositions($event);
        }
      }
    }
  }

  clearRangeSelection(value: string, $event: any, isBackspace: boolean) {
    value = value.slice(0, this.initialPosition) + value.slice(this.finalPosition);
    value = this.controlFormatting(value);
    $event.target.value = value;

    if (isBackspace) {
      this.checkMaskBefore($event, -1);
    }

    this.setPositions($event);
    this.resetPositions($event);
  }

  // passa a posição do click para o controle de posição
  click($event: any) {
    this.initialPosition = $event.target.selectionStart;
    this.finalPosition = $event.target.selectionEnd;
  }

  blur($event: any) {
    // Se houver algum valor definido na máscara
    if (this.mask) {
      // pega o valor do campo, formata e passa para o model
      let value = $event.target.value;
      value = this.controlFormatting(value);
      $event.target.value = value;
    }
  }

  revertPositions(initialPosition: number, finalPosition: number) {
    if (initialPosition > finalPosition) {
      // inverte o controle de posição caso o inicial esteja maior que o final
      let tempPosition;
      tempPosition = initialPosition;
      this.initialPosition = finalPosition;
      this.finalPosition = tempPosition;
    }
  }

  // reseta o controle de posição
  resetPositions($event: any) {
    this.initialPosition = $event.target.selectionStart;
    this.finalPosition = this.initialPosition;
  }

  // posiciona o cursor de acordo com o controle de posição
  setPositions($event: any) {
    $event.target.setSelectionRange(this.initialPosition, this.finalPosition);
  }

  // muda a posição do cursor e atualiza o controle de posição
  changePosition($event: any, value: number) {
    this.initialPosition = this.initialPosition + value;
    this.finalPosition = this.finalPosition + value;
    this.setPositions($event);
  }

  getPosition($event: any) {
    this.initialPosition = $event.target.selectionStart;
    this.finalPosition = $event.target.selectionEnd;
    this.setPositions($event);
  }

  // Método responsável por controlar a formatação e aplicar todas as máscara possíveis
  // quando houver valores opcionais (?)
  controlFormatting(value: string) {
    // Se o valor for vazio, retorna vazio
    if (!value) {
      this.valueToInput = '';
      this.valueToModel = '';
      return '';
    }
    let valueProcessed;
    let maskTmp = this.mask;

    // Array que será usado para armazenar todas as máscaras possíveis para
    // quando houver um valor opcional (?)
    const arrMasks: Array<any> = [];
    let contMasks = 0;

    // Enquanto houver algum 9? na máscara
    while (this.hasOptionalNumber(maskTmp)) {
      arrMasks.push(maskTmp);
      maskTmp = this.replaceOptionalNumber(maskTmp);
    }
    arrMasks.push(maskTmp);

    // Inverte o array
    arrMasks.reverse();

    // Informa que a formatação ainda não chegou ao fim
    this.formattingEnds = false;

    while (!this.formattingEnds) {
      // Seta a formatação como terminada
      // Então o método formatValue irá setar como não terminado caso haja
      this.formattingEnds = true;

      // Se não existe mais nenhuma máscara possível, então encerra a formatação
      if (!arrMasks[contMasks]) {
        break;
      }

      // Chama a formatação passando a máscara e o valor
      valueProcessed = this.formatValue(value, arrMasks[contMasks]);
      contMasks++;
    }

    return valueProcessed;
  }

  // Função que formata a máscara com o valor passado
  formatValue(value: string, mask: string) {
    // Remove as marcas de valor opciona (?)
    mask = mask.replace(/\?/g, '');

    // Substitui todos os caracteres que não são fixos da máscara por _
    const guide = mask.replace(this.listValidKeys(), '_');

    // Contador usado para percorrer o guide
    let contGuide: number = 0;

    // String final formatada
    let valueProcessed: string = '';

    // Remove do valor todos os caracteres fixos como ()/-+
    value = this.removeFormattingValue(value);

    // Percorre todo o valor e coloca a formatação de acordo com a máscara
    for (let i = 0; i < value.length; i++) {
      const charValue = value[i];

      // Se o guide acabou, seta a formatação como não terminada para que o método controlFormatting
      // tente formatar com outra possível máscara
      if (!guide[contGuide]) {
        this.formattingEnds = false;
        break;
      }

      // Percorre o Guide enquanto tem caracteres fixos
      while (this.isFixedCharacterGuide(guide[contGuide]) && guide[contGuide]) {
        valueProcessed += guide[contGuide];
        contGuide++;
      }

      // É um caracter válido de acordo com a máscara
      if (this.isKeyValidMask(charValue, mask[contGuide])) {
        valueProcessed += charValue;
        contGuide++;
      } else {
        // Se não é um caracter válido, deve interromper.
        break;
      }
    }

    if (this.formatModel) {
      this.valueToInput = valueProcessed;
      this.valueToModel = valueProcessed;
    } else {
      this.valueToInput = valueProcessed;
      this.valueToModel = this.removeFormattingValue(valueProcessed);
    }
    return valueProcessed;
  }
  // verifica se tem algum caracter de mascara antes do cursor
  checkMaskBefore($event: any, position: number) {
    if (this.isFixedCharacterGuide($event.target.value.toString().charAt(this.initialPosition - 1))) {
      this.changePosition($event, position);
      this.checkMaskBefore($event, position);
    }
  }

  // verifica se tem algum caracter de mascara depois do cursor
  checkMaskAfter($event: any, position: number) {
    if (this.isFixedCharacterGuide($event.target.value.toString().charAt(this.initialPosition))) {
      this.changePosition($event, position);
      this.checkMaskAfter($event, position);
    }
  }

  // Retorna a máscara sem um valor opcional
  replaceOptionalNumber(mask: string) {
    let i = 9;
    while (i >= 0) {
      if (mask.indexOf(i + '?') > -1) {
        return mask.replace(i + '?', '');
      }
      i--;
    }
    return mask;
  }

  // Verifica se contém caracteres permitidos somente na máscara \/() +-
  isFixedCharacterGuide(key: any) {
    return this.testRegex(key, this.getFixedCharacterGuide());
  }

  // Retorna caracteres permitidos somente na máscara \/() +-
  getFixedCharacterGuide() {
    return /[\\\/() +-.\:]/g;
  }

  // Caracteres permitidos de serem digitados
  listValidKeys() {
    return /[a-zA-Z0-9]/g;
  }

  // Se é um dígito válido
  isKeyValid(keyCode: any) {
    return this.isKeyCodeValid(keyCode);
  }

  // Verifica se a tecla digitada é permitida
  // Permite apenas números, letras, backspace e del
  isKeyCodeValid(keyCode: number) {
    return (
      (keyCode >= 48 && keyCode <= 57) ||
      (keyCode >= 65 && keyCode <= 90) ||
      (keyCode >= 96 && keyCode <= 105) ||
      keyCode === 8 ||
      keyCode === 9 ||
      keyCode === 46
    );
  }

  // Se está de acordo com a máscara
  isKeyValidMask(key: any, keyMask: any) {
    return this.testRegex(key, this.replaceMask(keyMask));
  }

  // Retorna se a chave foi aprovada pela expressão regular
  testRegex(key: any, regex: any) {
    return regex.test(key);
  }

  // Remove a formatacão do valor
  // É possível ser melhorado para remover pontualmente os caracteres fixos de acordo com a máscara
  removeFormattingValue(value: string) {
    return value.replace(this.getFixedCharacterGuide(), '');
  }

  // Verifica se contém valor opcional na máscara 0-9?
  hasOptionalNumber(mask: string) {
    return mask.match(/\d\?/g);
  }

  // Retorna a expressão regular correspondente ao comando passado
  replaceMask(char: string) {
    let regex = /./;
    switch (char) {
      case '0':
        regex = /[0]/;
        break;
      case '1':
        regex = /[0-1]/;
        break;
      case '2':
        regex = /[0-2]/;
        break;
      case '3':
        regex = /[0-3]/;
        break;
      case '4':
        regex = /[0-4]/;
        break;
      case '5':
        regex = /[0-5]/;
        break;
      case '6':
        regex = /[0-6]/;
        break;
      case '7':
        regex = /[0-7]/;
        break;
      case '8':
        regex = /[0-8]/;
        break;
      case '9':
        regex = /[0-9]/;
        break;
      case ' ':
        regex = /\s/;
        break;
      case '@':
        regex = /[a-zA-Z]/;
        break;
      case 'w':
        regex = /[a-zA-Z0-9]/;
        break;
    }
    return regex;
  }

  getRegexFromMask(mask: string) {
    if (mask) {
      let pattern;
      if (this.formatModel) {
        pattern = mask.replace(/\\/g, '\\\\');
        pattern = pattern.replace(/\+/g, '\\+');
        pattern = pattern.replace(/\./g, '\\.');
        pattern = pattern.replace(/-/g, '-');
        pattern = pattern.replace(/\(/g, '\\(');
        pattern = pattern.replace(/\)/g, '\\)');
        pattern = pattern.replace(/\//g, '\\/');
        pattern = pattern.replace(/\s/g, '\\s');
        pattern = pattern.replace(/:/g, '\\:');
        pattern = pattern.replace(/\@(?!\s)/g, '\\w');
        pattern = pattern.replace(/\d/g, '\\w');
      } else {
        pattern = mask.replace(/\\/g, '');
        pattern = pattern.replace(/\+/g, '');
        pattern = pattern.replace(/\./g, '');
        pattern = pattern.replace(/-/g, '');
        pattern = pattern.replace(/\(/g, '');
        pattern = pattern.replace(/\)/g, '');
        pattern = pattern.replace(/\//g, '');
        pattern = pattern.replace(/\s/g, '');
        pattern = pattern.replace(/:/g, '');
        pattern = pattern.replace(/\@/g, '\\w');
        pattern = pattern.replace(/\d/g, '\\w');
      }
      return pattern;
    } else {
      return null;
    }
  }
}
