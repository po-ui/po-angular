import { mergePoI18nConfigs } from './po-i18n.service';

describe('mergePoI18nConfigs', () => {
  it('should correctly merge the default configuration, prioritizing the first one found', () => {
    const input = [
      { default: { title: 'Hello' }, contexts: {} },
      { default: { title: 'Olá' }, contexts: {} }
    ];

    const result = mergePoI18nConfigs(input);

    expect(result.default).toEqual({ title: 'Hello' });
  });

  it('should return correctly merge contexts and languages', () => {
    const input = [
      {
        default: { title: 'Hello' },
        contexts: {
          home: {
            en: { welcome: 'Welcome' },
            pt: { welcome: 'Bem-vindo' }
          }
        }
      },
      {
        contexts: {
          home: {
            en: { goodbye: 'Goodbye' },
            es: { welcome: 'Bienvenido' }
          },
          about: {
            en: { info: 'Information' }
          }
        }
      }
    ];

    const result = mergePoI18nConfigs(input);

    expect(result.contexts).toEqual({
      home: {
        en: { welcome: 'Welcome', goodbye: 'Goodbye' },
        pt: { welcome: 'Bem-vindo' },
        es: { welcome: 'Bienvenido' }
      },
      about: {
        en: { info: 'Information' }
      }
    });
  });

  it('should return an empty object if the input is an empty array', () => {
    const result = mergePoI18nConfigs([]);
    expect(result).toEqual({ contexts: {} });
  });

  it('should return handle null or undefined values', () => {
    const input = [
      { default: { title: 'Hello' }, contexts: null },
      { contexts: undefined },
      { default: { title: 'Olá' }, contexts: { home: { en: { greeting: 'Hi' } } } }
    ];

    const result = mergePoI18nConfigs(input);

    expect(result.default).toEqual({ title: 'Hello' });
    expect(result.contexts).toEqual({
      home: {
        en: { greeting: 'Hi' }
      }
    });
  });
});
