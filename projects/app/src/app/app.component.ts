import { Component } from '@angular/core';
import { PoSkeletonType, PoThemeA11yEnum, poThemeDefault, PoThemeService, PoThemeTypeEnum } from 'projects/ui/src/lib';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false
})
export class AppComponent {
  constructor(private themeService: PoThemeService) {
    this.themeService.setTheme(poThemeDefault, PoThemeTypeEnum.light, PoThemeA11yEnum.AA);
  }
  animation: string;
  borderRadius: string;
  height: string;
  size: string;
  type: string;
  variant: string;
  width: string;

  // Circle dynamic size control
  circleSize: number;
  circleSizeUnit: string = 'px';

  readonly animationOptions = [
    { label: 'Shimmer', value: 'shimmer' },
    { label: 'Pulse', value: 'pulse' },
    { label: 'None', value: 'none' }
  ];

  readonly sizeOptions = [
    { label: 'Small', value: 'sm' },
    { label: 'Medium', value: 'md' },
    { label: 'Large', value: 'lg' },
    { label: 'Extra Large', value: 'xl' }
  ];

  readonly typeOptions = [
    { label: 'Normal', value: 'normal' },
    { label: 'Primary', value: 'primary' },
    { label: 'Content', value: 'content' }
  ];

  readonly variantOptions = [
    { label: 'Circle', value: 'circle' },
    { label: 'Text', value: 'text' },
    { label: 'Rectangle', value: 'rectangle' },
    { label: 'Square', value: 'square' }
  ];

  readonly unitOptions = [
    { label: 'Pixels (px)', value: 'px' },
    { label: 'REM', value: 'rem' },
    { label: 'EM', value: 'em' },
    { label: 'Percentage (%)', value: '%' }
  ];

  ngOnInit() {
    this.restore();
  }

  get modelValue() {
    return JSON.stringify(
      {
        variant: this.variant,
        type: this.type,
        animation: this.animation,
        size: this.size,
        width: this.width,
        height: this.height,
        borderRadius: this.borderRadius
      },
      null,
      2
    );
  }

  onVariantChange() {
    // Reset custom properties when variant changes
    this.width = '';
    this.height = '';
    this.borderRadius = '';
    this.circleSize = null;
  }

  onCircleSizeChange() {
    if (this.circleSize && this.variant === 'circle') {
      const sizeValue = `${this.circleSize}${this.circleSizeUnit}`;
      this.width = sizeValue;
      this.height = sizeValue;
      this.borderRadius = '50%';
    } else {
      this.width = '';
      this.height = '';
      this.borderRadius = '';
    }
  }

  onCircleSizeUnitChange() {
    // Reapply size when unit changes
    this.onCircleSizeChange();
  }

  restore() {
    this.variant = 'circle';
    this.type = 'normal';
    this.animation = 'shimmer';
    this.size = 'md';
    this.width = '';
    this.height = '';
    this.borderRadius = '';
    this.circleSize = null;
    this.circleSizeUnit = 'px';
  }
  // animation: string;
  // borderRadius: string;
  // height: string;
  // variant: string;
  // width: string;
  // isDarkTheme: boolean = false;
  // type: PoSkeletonType;

  // readonly animationOptions = [
  //   { label: 'Shimmer', value: 'shimmer' },
  //   { label: 'Pulse', value: 'pulse' },
  //   { label: 'None', value: 'none' }
  // ];

  // readonly variantOptions = [
  //   { label: 'Text', value: 'text' },
  //   { label: 'Rectangle', value: 'rect' },
  //   { label: 'Circle', value: 'circle' }
  // ];

  // ngOnInit() {
  //   this.restore();
  // }

  // get modelValue() {
  //   return JSON.stringify(
  //     {
  //       variant: this.variant,
  //       animation: this.animation,
  //       width: this.width,
  //       height: this.height,
  //       borderRadius: this.borderRadius
  //     },
  //     null,
  //     2
  //   );
  // }

  // restore() {
  //   this.variant = 'text';
  //   this.animation = 'shimmer';
  //   this.width = '100%';
  //   this.height = undefined;
  //   this.borderRadius = undefined;
  // }

  // toggleTheme(isDark: boolean) {
  //   const themeType = isDark ? PoThemeTypeEnum.dark : PoThemeTypeEnum.light;
  //   this.themeService.setTheme(poThemeDefault, themeType, PoThemeA11yEnum.AA);
  // }
}
