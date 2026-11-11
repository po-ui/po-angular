import { TestBed } from '@angular/core/testing';

import { PoModule } from './po.module';
import { PoThemeService } from './services';

describe('PoModule:', () => {
  const themeServiceMock = {} as PoThemeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: PoThemeService, useValue: themeServiceMock }]
    });
  });

  it('should be created', () => {
    const module = TestBed.runInInjectionContext(() => new PoModule());

    expect(module).toBeTruthy();
  });

  it('should inject PoThemeService', () => {
    const module = TestBed.runInInjectionContext(() => new PoModule());

    expect(module.themeService).toBe(themeServiceMock);
  });
});
