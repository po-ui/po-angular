/**
 * Expect dinamico para validar metódos setters.
 *
 * @param comp componente a ser testado.
 * @param property nome da propriedade setter.
 * @param testedValues valor ou array de valores que serão passados para o método, quando for passado um array para o parametro
 *  expectValues, será usada a posição do mesmo para comparar os valores.
 *  Caso precise passar um array como valor para comparação, deve-se colocar o array dentro de um array.
 * @param expectValues valor ou array de valores esperado depois de tratado pelo método setter.
 *  Caso precise passar um array como valor para comparação, deve-se colocar o array dentro de um array.
 */
export const expectPropertiesValues = (comp: any, property: string, testedValues: any, expectValues: any) => {
  if (!(testedValues instanceof Array)) {
    testedValues = [testedValues];
  }

  if (!(expectValues instanceof Array) || (expectValues instanceof Array && expectValues.length === 0)) {
    expectValues = [expectValues];
  }

  testedValues.forEach((value, index) => {
    const expectValue = expectValues[index] || expectValues[index] === 0 ? expectValues[index] : expectValues[0];

    comp[property] = value;
    const errorMessage =
      comp[property] === undefined
        ? `method getter not defined for property "${property}"`
        : `setter called with "${value}" (${typeof value}), returned "${
            comp[property]
          }", but expected "${expectValue}"`;

    if (expectValue instanceof Array || expectValue instanceof Object) {
      expect(comp[property]).toEqual(expectValue, errorMessage);
    } else {
      expect(comp[property]).toBe(expectValue, errorMessage);
    }
  });
};
