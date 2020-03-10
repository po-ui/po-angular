import { PoI18nBasePipe } from './po-i18n-base.pipe';

describe('PoI18nBasePipe', () => {
  it('should be created', () => {
    const pipe = new PoI18nBasePipe();
    expect(pipe).toBeTruthy();
  });

  it('should be replaced by numbers', () => {
    const pipe = new PoI18nBasePipe();
    expect(pipe.transform('Pagina {1} de {2} paginas', [1, 2])).toEqual('Pagina 1 de 2 paginas');
  });

  it('should be replaced by letters', () => {
    const pipe = new PoI18nBasePipe();
    expect(pipe.transform('Pagina {currencyPage} de {totalPage} paginas', [1, 1000])).toEqual(
      'Pagina 1 de 1000 paginas'
    );
  });

  it('should be value is blank', () => {
    const pipe = new PoI18nBasePipe();
    expect(pipe.transform(null, [1, 1000])).toEqual('');
  });

  it('should be value with empty array', () => {
    const pipe = new PoI18nBasePipe();
    expect(pipe.transform('Pagina {currencyPage} de {totalPage} paginas', [])).toEqual(
      'Pagina {currencyPage} de {totalPage} paginas'
    );
  });

  it('should be replaced with one parameter and two parameters in array', () => {
    const pipe = new PoI18nBasePipe();
    expect(pipe.transform('Pagina {1}', [1, 2])).toEqual('Pagina 1');
  });

  it('should be replaced with one parameter and two parameters in array', () => {
    const pipe = new PoI18nBasePipe();
    expect(pipe.transform('Pagina {1} de {2} paginas', [1])).toEqual('Pagina 1 de {2} paginas');
  });

  it('should be replaced with one parameter', () => {
    const pipe = new PoI18nBasePipe();
    expect(pipe.transform('Pagina {1}', 1)).toEqual('Pagina 1');
  });

  it('should be replaced with string parameter', () => {
    const pipe = new PoI18nBasePipe();
    expect(pipe.transform('Pagina {1}', '1')).toEqual('Pagina 1');
  });
});
