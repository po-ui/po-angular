import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>',
  standalone: false
})
export class AppComponent {}

@Component({
  selector: 'visual-home',
  standalone: false,
  template: `
    <div style="max-width: 960px; margin: 0 auto; padding: 24px; font-family: 'NotoSans', Arial, sans-serif;">
      <h1 style="font-size: 24px; margin-bottom: 8px;">PO UI - Visual Regression Tests</h1>
      <p style="color: #666; margin-bottom: 32px;">
        Cenarios de teste visual para componentes PO UI. Clique em um cenario para visualiza-lo.
      </p>

      <h2 style="font-size: 18px; margin-bottom: 12px; border-bottom: 2px solid #1464a5; padding-bottom: 8px;">
        Fields - Combinacoes de estados
      </h2>
      <div
        style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 12px; margin-bottom: 32px;"
      >
        <a
          *ngFor="let route of fieldRoutes"
          [routerLink]="'/' + route.path"
          style="display: block; padding: 12px 16px; border: 1px solid #dae0e5; border-radius: 4px; text-decoration: none; color: #1464a5; transition: background 0.15s;"
          onmouseover="this.style.background='#f0f4f8'"
          onmouseout="this.style.background='white'"
        >
          <strong>{{ route.label }}</strong>
          <span style="display: block; font-size: 12px; color: #888; margin-top: 4px;">{{ route.description }}</span>
        </a>
      </div>

      <h2 style="font-size: 18px; margin-bottom: 12px; border-bottom: 2px solid #1464a5; padding-bottom: 8px;">
        Samples - Componentes basicos
      </h2>
      <div
        style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 12px; margin-bottom: 32px;"
      >
        <a
          *ngFor="let route of sampleRoutes"
          [routerLink]="'/' + route.path"
          style="display: block; padding: 12px 16px; border: 1px solid #dae0e5; border-radius: 4px; text-decoration: none; color: #1464a5; transition: background 0.15s;"
          onmouseover="this.style.background='#f0f4f8'"
          onmouseout="this.style.background='white'"
        >
          <strong>{{ route.label }}</strong>
          <span style="display: block; font-size: 12px; color: #888; margin-top: 4px;">{{ route.description }}</span>
        </a>
      </div>
    </div>
  `
})
export class VisualHomeComponent {
  fieldRoutes = [
    {
      path: 'visual/fields/po-input-states',
      label: 'po-input',
      description: 'basic, label, helper, help, disabled, readonly, required, error, loading'
    },
    {
      path: 'visual/fields/po-decimal-states',
      label: 'po-decimal',
      description: 'basic, label, helper, help, disabled, readonly, required, error, loading'
    },
    {
      path: 'visual/fields/po-email-states',
      label: 'po-email',
      description: 'basic, label, helper, help, disabled, readonly, required, error, loading'
    },
    {
      path: 'visual/fields/po-login-states',
      label: 'po-login',
      description: 'basic, label, helper, help, disabled, readonly, required, error, loading'
    },
    {
      path: 'visual/fields/po-number-states',
      label: 'po-number',
      description: 'basic, label, helper, help, disabled, readonly, required, error, loading'
    },
    {
      path: 'visual/fields/po-password-states',
      label: 'po-password',
      description: 'basic, label, helper, help, disabled, readonly, required, error, loading'
    },
    {
      path: 'visual/fields/po-url-states',
      label: 'po-url',
      description: 'basic, label, helper, help, disabled, readonly, required, error, loading'
    },
    {
      path: 'visual/fields/po-textarea-states',
      label: 'po-textarea',
      description: 'basic, label, helper, help, disabled, readonly, required, error'
    },
    {
      path: 'visual/fields/po-select-states',
      label: 'po-select',
      description: 'basic, label, helper, help, disabled, readonly, required, error'
    },
    {
      path: 'visual/fields/po-combo-states',
      label: 'po-combo',
      description: 'basic, label, helper, help, disabled, required, error'
    },
    {
      path: 'visual/fields/po-datepicker-states',
      label: 'po-datepicker',
      description: 'basic, label, helper, help, disabled, readonly, required, error'
    },
    {
      path: 'visual/fields/po-datepicker-range-states',
      label: 'po-datepicker-range',
      description: 'basic, label, helper, help, disabled, readonly, required'
    },
    {
      path: 'visual/fields/po-lookup-states',
      label: 'po-lookup',
      description: 'basic, label, helper, help, disabled, required'
    },
    {
      path: 'visual/fields/po-multiselect-states',
      label: 'po-multiselect',
      description: 'basic, label, helper, help, disabled, required'
    },
    {
      path: 'visual/fields/po-rich-text-states',
      label: 'po-rich-text',
      description: 'basic, label, helper, help, disabled, readonly, required'
    },
    {
      path: 'visual/fields/po-upload-states',
      label: 'po-upload',
      description: 'basic, label, helper, help, disabled, required'
    },
    { path: 'visual/fields/po-checkbox-states', label: 'po-checkbox', description: 'basic, label, disabled' },
    {
      path: 'visual/fields/po-checkbox-group-states',
      label: 'po-checkbox-group',
      description: 'basic, label, helper, help, disabled, required'
    },
    { path: 'visual/fields/po-switch-states', label: 'po-switch', description: 'basic, label, helper, disabled' },
    {
      path: 'visual/fields/po-radio-group-states',
      label: 'po-radio-group',
      description: 'basic, label, helper, help, disabled, required'
    }
  ];

  sampleRoutes = [
    { path: 'visual/po-button-basic', label: 'po-button', description: 'Sample basico' },
    { path: 'visual/po-button-group-basic', label: 'po-button-group', description: 'Sample basico' },
    { path: 'visual/po-input-basic', label: 'po-input (sample)', description: 'Sample basico' },
    { path: 'visual/po-checkbox-basic', label: 'po-checkbox (sample)', description: 'Sample basico' },
    { path: 'visual/po-switch-basic', label: 'po-switch (sample)', description: 'Sample basico' },
    { path: 'visual/po-select-basic', label: 'po-select (sample)', description: 'Sample basico' },
    { path: 'visual/po-table-basic', label: 'po-table', description: 'Sample basico' },
    { path: 'visual/po-tag-basic', label: 'po-tag', description: 'Sample basico' },
    { path: 'visual/po-accordion-basic', label: 'po-accordion', description: 'Sample basico' },
    { path: 'visual/po-divider-basic', label: 'po-divider', description: 'Sample basico' },
    { path: 'visual/po-progress-basic', label: 'po-progress', description: 'Sample basico' },
    { path: 'visual/po-input-states', label: 'po-input (estados legado)', description: '13 combinacoes de estado' }
  ];
}
