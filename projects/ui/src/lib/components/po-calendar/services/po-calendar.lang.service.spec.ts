import { PoCalendarLangService } from './po-calendar.lang.service';

describe('PoCalendarLangService:', () => {
  let service: PoCalendarLangService;

  beforeEach(() => {
    service = new PoCalendarLangService();
  });

  it('should have a `service` attribute that is a PoCalendarLangService', () => {
    expect(service instanceof PoCalendarLangService).toBeTruthy();
  });

  it('should set language', () => {
    service.setLanguage('pt');
    expect(service['language']).toBe('pt');

    service.setLanguage('en');
    expect(service['language']).toBe('en');

    service.setLanguage('es');
    expect(service['language']).toBe('es');

    service.setLanguage('ru');
    expect(service['language']).toBe('ru');

    service.setLanguage('rs');
    expect(service['language']).toBe('pt');

    service['language'] = 'pt';
    service.setLanguage('p');
    expect(service['language']).toBe('pt');

    service.setLanguage(null);
    expect(service['language']).toBe('pt');
  });

  it('should get word month', () => {
    service['language'] = 'pt';
    expect(service.getMonthLabel()).toBe('Mês');
  });

  it('should get word year', () => {
    service['language'] = 'pt';
    expect(service.getYearLabel()).toBe('Ano');
  });

  it('should get month name', () => {
    service['language'] = 'pt';
    expect(service.getMonth(0)).toBe('Janeiro');
  });

  it('should get week days', () => {
    service['language'] = 'pt';
    expect(service.getWeekDays(1)).toBe('Seg');
  });

  it('should get array of months', () => {
    service['language'] = 'pt';

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

    expect(service.getMonthsArray().toString()).toBe(months.toString());
  });

  it('should get array of week days', () => {
    service['language'] = 'pt';

    const weekDays = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'];

    expect(service.getWeekDaysArray().toString()).toBe(weekDays.toString());
  });
});
