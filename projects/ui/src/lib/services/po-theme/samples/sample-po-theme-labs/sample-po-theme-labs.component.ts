import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';

import {
  PoModalAction,
  PoModalComponent,
  PoRadioGroupOption,
  PoTheme,
  PoThemeA11yEnum,
  poThemeDefault,
  poThemeDefaultDeprecated,
  PoThemeService,
  PoThemeTypeEnum
} from '@po-ui/ng-components';

type SampleTheme = 'evo' | 'deprecated';

@Component({
  selector: 'sample-po-theme-labs',
  templateUrl: './sample-po-theme-labs.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false
})
export class SamplePoThemeLabsComponent implements OnInit {
  @ViewChild('reactiveFormData', { static: true }) reactiveFormModal: PoModalComponent;

  private readonly formBuilder = inject(UntypedFormBuilder);
  private readonly poTheme = inject(PoThemeService);
  private readonly changeDetector = inject(ChangeDetectorRef);

  theme: SampleTheme = 'evo';
  themeType: PoThemeTypeEnum = PoThemeTypeEnum.light;
  a11yLevel: PoThemeA11yEnum = PoThemeA11yEnum.AAA;
  densityMode: string = 'medium';
  exampleVisible = true;

  reactiveForm: UntypedFormGroup = this.createReactiveForm();

  readonly themeOptions: Array<PoRadioGroupOption> = [
    { label: 'EVO (default)', value: 'evo' },
    { label: 'PO UI (deprecated)', value: 'deprecated' }
  ];

  readonly themeTypeOptions: Array<PoRadioGroupOption> = [
    { label: 'Light', value: PoThemeTypeEnum.light },
    { label: 'Dark', value: PoThemeTypeEnum.dark }
  ];

  readonly a11yLevelOptions: Array<PoRadioGroupOption> = [
    { label: 'AAA', value: PoThemeA11yEnum.AAA },
    { label: 'AA', value: PoThemeA11yEnum.AA }
  ];

  readonly densityModeOptions: Array<PoRadioGroupOption> = [
    { label: 'Medium', value: 'medium' },
    { label: 'Small', value: 'small' }
  ];

  readonly modalPrimaryAction: PoModalAction = {
    action: () => this.reactiveFormModal.close(),
    label: 'Close'
  };

  private readonly themes: Record<SampleTheme, PoTheme> = {
    evo: poThemeDefault,
    deprecated: poThemeDefaultDeprecated
  };

  ngOnInit(): void {
    // Only reads the current preferences (saved by the service); nothing is applied when the sample opens.
    const active = this.poTheme.getThemeActive();

    if (active) {
      this.theme = active.name === poThemeDefaultDeprecated.name ? 'deprecated' : 'evo';

      if (typeof active.active === 'object') {
        this.themeType = active.active.type ?? PoThemeTypeEnum.light;
        this.a11yLevel = active.active.a11y ?? PoThemeA11yEnum.AAA;
      }
    }

    this.densityMode = this.poTheme.getDensityMode();
  }

  applyTheme(): void {
    // 1. the theme, with its type (light/dark) and accessibility level
    this.poTheme.setTheme(this.themes[this.theme], this.themeType, this.a11yLevel);
    // 2. the `small` default size, only for AA; it reads the level set above
    this.poTheme.setA11yDefaultSizeSmall(this.a11yLevel === PoThemeA11yEnum.AA);
    // 3. the density of grouping components (pages, containers, modals), for any level
    this.poTheme.setDensityMode(this.densityMode);

    // components read the default size when they are created: render the example again
    this.exampleVisible = false;
    this.changeDetector.detectChanges();
    this.exampleVisible = true;
  }

  saveForm(): void {
    this.reactiveFormModal.open();
  }

  private createReactiveForm(): UntypedFormGroup {
    return this.formBuilder.group({
      name: ['', Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(30)])],
      address: ['', Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(50)])],
      number: ['', Validators.compose([Validators.required, Validators.min(1), Validators.max(99999)])],
      email: ['', Validators.required],
      website: ['', Validators.required]
    });
  }
}
