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

  it('should get today label in Portuguese', () => {
    service['language'] = 'pt';
    expect(service.getTodayLabel()).toBe('Hoje');
  });

  it('should get today label in English', () => {
    service['language'] = 'en';
    expect(service.getTodayLabel()).toBe('Today');
  });

  it('should get previous month label in Portuguese', () => {
    service['language'] = 'pt';
    expect(service.getPreviousMonthLabel()).toBe('Mês anterior');
  });

  it('should get previous month label in English', () => {
    service['language'] = 'en';
    expect(service.getPreviousMonthLabel()).toBe('Previous month');
  });

  it('should get previous month label in Spanish', () => {
    service['language'] = 'es';
    expect(service.getPreviousMonthLabel()).toBe('Mes anterior');
  });

  it('should get previous month label in Russian', () => {
    service['language'] = 'ru';
    expect(service.getPreviousMonthLabel()).toBe('Предыдущий месяц');
  });

  it('should get next month label in Portuguese', () => {
    service['language'] = 'pt';
    expect(service.getNextMonthLabel()).toBe('Próximo mês');
  });

  it('should get next month label in English', () => {
    service['language'] = 'en';
    expect(service.getNextMonthLabel()).toBe('Next month');
  });

  it('should get next month label in Spanish', () => {
    service['language'] = 'es';
    expect(service.getNextMonthLabel()).toBe('Próximo mes');
  });

  it('should get next month label in Russian', () => {
    service['language'] = 'ru';
    expect(service.getNextMonthLabel()).toBe('Следующий месяц');
  });

  it('should get to clean label in Portuguese', () => {
    service['language'] = 'pt';
    expect(service.getToCleanLabel()).toBe('Limpar');
  });
});
