import { PoImageBaseComponent } from './po-image-base.component';

describe('PoImageBaseComponent:', () => {
  const component = new PoImageBaseComponent();

  it('should be created', () => {
    expect(component instanceof PoImageBaseComponent).toBeTruthy();
  });

  it('should isBase64 to true for valid image base64 string', () => {
    const validBase64 = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD';
    component.source = validBase64;
    expect(component.isBase64).toBe(true);
  });
});
