/**
 * Função que verifica se outra função assíncrona retornou uma Promise.resolve ou uma Promise.reject.
 * Caso tenha retornado uma Promise.reject, o handleThrowError retornará uma função com o erro.
 *
 * Esta função é útil para testes onde se deseja verificar se o retorno foi uma exceção em uma função assíncrona e
 * poder utilizar o .toThrow() do jasmine.
 * @param testFunction Função que será verificado o retorno.
 */
export function handleThrowError(testFunction) {
  return testFunction
    .then(response => () => response)
    .catch(error => () => {
      throw error;
    });
}
