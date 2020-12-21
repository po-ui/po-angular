import { PoCalendarLangService } from './po-calendar.lang.service';

describe('PoCalendarLangService', () => {
  let service: PoCalendarLangService;

  beforeEach(() => {
    service = new PoCalendarLangService();
  });

  it('should have a `service` attribute that is a PoCalendarLangService', () => {
    expect(service instanceof PoCalendarLangService).toBeTruthy();
  });

  it('should set language', () => {
    service.setLanguage('pt');
    expect(service.lang).toBe('pt');

    service.setLanguage('en');
    expect(service.lang).toBe('en');

    service.setLanguage('es');
    expect(service.lang).toBe('es');

    service.setLanguage('ru');
    expect(service.lang).toBe('ru');

    service.setLanguage('rs');
    expect(service.lang).toBe('pt');

    service.lang = 'pt';
    service.setLanguage('p');
    expect(service.lang).toBe('pt');

    service.setLanguage(null);
    expect(service.lang).toBe('pt');
  });

  it('should get word month', () => {
    service.lang = 'pt';
    expect(service.getWordMonth()).toBe('Mês');
  });

  it('should get word year', () => {
    service.lang = 'pt';
    expect(service.getWordYear()).toBe('Ano');
  });

  it('should get month name', () => {
    service.lang = 'pt';
    expect(service.getMonth(0)).toBe('Janeiro');
  });

  it('should get week days', () => {
    service.lang = 'pt';
    expect(service.getWeedDays(1)).toBe('Seg');
  });

  it('should get array of months', () => {
    service.lang = 'pt';

    const months = [
      'Janeiro',
      'Fevereiro',
      'Março',
      'Abril',
      'Maio',
      'Junho',
      'Julho',
      'Agosto',
      'Setembro',
      'Outubro',
      'Novembro',
      'Dezembro'
    ];

    expect(service.getArrayMonths().toString()).toBe(months.toString());
  });

  it('should get array of week days', () => {
    service.lang = 'pt';

    const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

    expect(service.getArrayWeekDays().toString()).toBe(weekDays.toString());
  });
});
