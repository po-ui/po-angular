import { PoI18nPipe } from './po-i18n.pipe';

describe('PoI18nPipe', () => {
  let pipe: PoI18nPipe;

  it('should have a `pipe` attribute that is a PoI18nPipe', () => {
    pipe = new PoI18nPipe();

    expect(pipe instanceof PoI18nPipe).toBeTruthy();
  });
});
