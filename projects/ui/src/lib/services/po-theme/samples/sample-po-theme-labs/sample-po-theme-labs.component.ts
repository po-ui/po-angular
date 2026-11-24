import { ChangeDetectionStrategy, Component, inject, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';

import {
  PoModalAction,
  PoModalComponent,
  PoRadioGroupOption,
  PoThemeA11yEnum,
  PoThemeService,
  PoThemeTypeEnum
} from '@po-ui/ng-components';

import { poThemeSample } from './sample-po-theme-labs.constant';

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

  themeType: PoThemeTypeEnum = PoThemeTypeEnum.light;
  a11yLevel: PoThemeA11yEnum = PoThemeA11yEnum.AAA;
  densityMode: string = 'medium';

  reactiveForm: UntypedFormGroup = this.createReactiveForm();

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

  ngOnInit(): void {
    // Reaproveita a preferência salva pelo serviço (chave `totvs-theme`), quando existir.
    const active = this.poTheme.getThemeActive()?.active;

    if (typeof active === 'object') {
      this.themeType = active.type ?? PoThemeTypeEnum.light;
      this.a11yLevel = active.a11y ?? PoThemeA11yEnum.AAA;
    }
    this.densityMode = this.poTheme.getDensityMode();

    this.poTheme.setTheme(poThemeSample, this.themeType, this.a11yLevel);
    this.applyA11yDefaultSize();
    this.poTheme.setDensityMode(this.densityMode);
  }

  onThemeTypeChange(type: PoThemeTypeEnum): void {
    this.poTheme.setCurrentThemeType(type);
  }

  onA11yLevelChange(a11yLevel: PoThemeA11yEnum): void {
    this.poTheme.setCurrentThemeA11y(a11yLevel);
    this.applyA11yDefaultSize();
  }

  onDensityModeChange(mode: string): void {
    this.poTheme.setDensityMode(mode);
  }

  saveForm(): void {
    this.reactiveFormModal.open();
  }

  // O tamanho `small` só se aplica no nível AA e deve ser definido depois do nível de acessibilidade.
  private applyA11yDefaultSize(): void {
    this.poTheme.setA11yDefaultSizeSmall(this.a11yLevel === PoThemeA11yEnum.AA);
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
