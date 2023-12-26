import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  @ViewChild('lightest') lightest: HTMLElement;
  @ViewChild('lighter') lighter: HTMLElement;
  @ViewChild('light') light: HTMLElement;
  @ViewChild('base') base: HTMLElement;
  @ViewChild('dark') dark: HTMLElement;
  @ViewChild('darker') darker: HTMLElement;
  @ViewChild('darkest') darkest: HTMLElement;
  @ViewChild('borderRadius') borderRadius: HTMLElement;
  @ViewChild('borderRadius') borderWidth: HTMLElement;
  @ViewChild('heightCustomHtml') heightCustomHtml: HTMLElement;

  colorCustom: FormGroup;
  borderRadiousCustom: FormGroup;
  borderWidthCustom: FormGroup;
  heightCustom: FormGroup;

  options: Array<any> = [
    { value: 'poMultiselect1', label: 'PO Multiselect 1' },
    { value: 'poMultiselect2', label: 'PO Multiselect 2' }
  ];

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.colorCustom = this.formBuilder.group({
      colorBrand: ['#753399'] as any
    });

    this.borderRadiousCustom = this.formBuilder.group({
      borderRadius: [null]
    });

    this.borderWidthCustom = this.formBuilder.group({
      borderWidth: [null]
    });

    this.heightCustom = this.formBuilder.group({
      height: [null]
    });
  }

  ngAfterViewInit(): void {
    this.colorCustom.valueChanges.subscribe(changes => this.checkChangesColorCustom(changes));
    this.borderRadiousCustom.valueChanges.subscribe(changes => this.checkChangesBorderCustom(changes));
    this.borderWidthCustom.valueChanges.subscribe(changes => this.checkChangesBorderWidth(changes));
    this.heightCustom.valueChanges.subscribe(changes => this.checkChangesHeight(changes));
  }

  checkChangesColorCustom(changes: any): void {
    this.generateColorVariations(changes.colorBrand);
  }

  checkChangesBorderCustom(changes: any): void {
    document.querySelector('html').style.setProperty('--custom-border-radius', changes.borderRadius + 'px');
    this.borderRadius['nativeElement'].innerHTML = '<br>--custom-border-radius : ' + changes.borderRadius + 'px' + ';';
  }

  checkChangesBorderWidth(changes: any): void {
    document.querySelector('html').style.setProperty('--custom-border-width', changes.borderWidth + 'px');
    this.borderWidth['nativeElement'].innerHTML = '<br>--custom-border-width : ' + changes.borderWidth + 'px' + ';';
  }

  checkChangesHeight(changes: any): void {
    document.querySelector('html').style.setProperty('--custom-default-height', changes.height + 'px');
    this.heightCustomHtml['nativeElement'].innerHTML = '<br>--custom-default-height : ' + changes.height + 'px' + ';';
  }

  private generateColorVariations(baseColor: string): Array<string> {
    // Validate the baseColor parameter (optional)
    if (!/^#([0-9A-Fa-f]{3}){1,2}$/.test(baseColor)) {
      throw new Error('Invalid color format. Please provide a valid hexadecimal color code.');
    }
    const lightest = this.adjustColor(baseColor, 0.1, true);
    const lighter = this.adjustColor(baseColor, 0.3, true);
    const light = this.adjustColor(baseColor, 0.5, true);
    const base = this.adjustColor(baseColor, 1, false);
    const dark = this.adjustColor(baseColor, 0.7, false);
    const darker = this.adjustColor(baseColor, 0.45, false);
    const darkest = this.adjustColor(baseColor, 0.2, false);

    document.querySelector('html').style.setProperty('--color-brand-01-lightest', lightest);
    document.querySelector('html').style.setProperty('--color-brand-01-lighter', lighter);
    document.querySelector('html').style.setProperty('--color-brand-01-light', light);
    document.querySelector('html').style.setProperty('--color-brand-01-base', base);
    document.querySelector('html').style.setProperty('--color-brand-01-dark', dark);
    document.querySelector('html').style.setProperty('--color-brand-01-darker', darker);
    document.querySelector('html').style.setProperty('--color-brand-01-darkest', darkest);

    this.preencheCodigo(lightest, lighter, light, base, dark, darker, darkest);
    return [lightest, lighter, light, base, dark, darker, darkest];
  }

  private adjustColor(color: string, factor: number, luminance: boolean): string {
    const hex = parseInt(color.slice(1), 16);
    // eslint-disable-next-line no-bitwise
    const r = luminance ? (hex >> 16) & 0xff : Math.max(0, Math.min(255, Math.round((hex >> 16) * factor)));
    // eslint-disable-next-line no-bitwise
    const g = luminance ? (hex >> 8) & 0xff : Math.max(0, Math.min(255, Math.round(((hex >> 8) & 0xff) * factor)));
    // eslint-disable-next-line no-bitwise
    const b = luminance ? hex & 0xff : Math.max(0, Math.min(255, Math.round((hex & 0xff) * factor)));
    // eslint-disable-next-line no-bitwise
    // const a = (hex & 0xFF) / 255;

    // eslint-disable-next-line no-bitwise
    return luminance ? `rgba(${r}, ${g}, ${b}, ${factor})` : `rgb(${r}, ${g}, ${b})`;
    // return alpha !== undefined ? `rgba(${r}, ${g}, ${b}, ${alpha.toFixed(2)})` : `#${((r << 16 | g << 8 | b).toString(16).padStart(6, '0'))}`;
  }

  preencheCodigo(lightest, lighter, light, base, dark, darker, darkest) {
    this.lightest['nativeElement'].innerHTML = '<br>--color-brand-01-lightest : ' + lightest + ';';
    this.lighter['nativeElement'].innerHTML = '<br>--color-brand-01-lighter : ' + lighter + ';';
    this.light['nativeElement'].innerHTML = '<br>--color-brand-01-light : ' + light + ';';
    this.base['nativeElement'].innerHTML = '<br>--color-brand-01-base : ' + base + ';';
    this.dark['nativeElement'].innerHTML = '<br>--color-brand-01-dark : ' + dark + ';';
    this.darker['nativeElement'].innerHTML = '<br>--color-brand-01-darker : ' + darker + ';';
    this.darkest['nativeElement'].innerHTML = '<br>--color-brand-01-darkest : ' + darkest + ';';
  }
}
