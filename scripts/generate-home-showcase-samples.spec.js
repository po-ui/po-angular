// npx jasmine scripts/generate-home-showcase-samples.spec.js
const {
  attributeNames,
  buildTemplate,
  escapeForTemplate,
  validateSampleHtml
} = require('./generate-home-showcase-samples');

describe('generate-home-showcase-samples', () => {
  describe('escapeForTemplate', () => {
    it('should escape what the Angular template compiler would interpret', () => {
      expect(escapeForTemplate('{{ a }} { b } user@mail.com')).toBe(
        '&#123;&#123; a &#125;&#125; &#123; b &#125; user&#64;mail.com'
      );
    });

    it('should keep the rest untouched', () => {
      expect(escapeForTemplate('<b class="x">ok</b>')).toBe('<b class="x">ok</b>');
    });
  });

  describe('attributeNames', () => {
    it('should list the attributes of all tags, ignoring text and values', () => {
      expect(
        attributeNames('<a href="x > y" (click)="go()" hidden>(not an attribute)</a><i class=a data-x=\'1\'></i>')
      ).toEqual(['href', '(click)', 'hidden', 'class', 'data-x']);
    });
  });

  describe('validateSampleHtml', () => {
    it('should accept plain markup, even with parentheses and brackets in the text', () => {
      expect(() =>
        validateSampleHtml('ok', '<label>Indeterminado (parcial) [x]</label><input type="checkbox" checked="">')
      ).not.toThrow();
    });

    [
      '<script>alert(1)</script>',
      '<iframe src="x"></iframe>',
      '<a href="javascript:alert(1)">x</a>',
      '<b>{{ x }}</b>'
    ].forEach(html =>
      it(`should reject ${html}`, () => {
        expect(() => validateSampleHtml('bad', html)).toThrow();
      })
    );

    [
      '<a onclick="x()">',
      '<a onmouseover=x>',
      '<a (click)="x()">',
      '<a [x]="y">',
      '<a *ngIf="y">',
      '<a #ref>',
      '<a @flag>'
    ].forEach(html =>
      it(`should reject the attribute in ${html}`, () => {
        expect(() => validateSampleHtml('bad', html)).toThrow();
      })
    );
  });

  describe('buildTemplate', () => {
    it('should build a @switch with one escaped @case per sample', () => {
      const template = buildTemplate({ 'po-a': '<x>{a}</x>', 'po-b': '<y>@b</y>' });
      expect(template).toContain('@switch (name) {');
      expect(template).toContain("@case ('po-a') {\n    <x>&#123;a&#125;</x>\n  }");
      expect(template).toContain("@case ('po-b') {\n    <y>&#64;b</y>\n  }");
    });

    it('should refuse unsafe samples', () => {
      expect(() => buildTemplate({ 'po-a': '<script></script>' })).toThrow();
    });
  });
});
