import { describe, it, expect } from 'vitest';

import { PoMenuHeaderTemplateDirective } from './po-menu-header-template.directive';

describe('PoMenuHeaderTemplateDirective:', () => {
  const component = new PoMenuHeaderTemplateDirective(null);

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
