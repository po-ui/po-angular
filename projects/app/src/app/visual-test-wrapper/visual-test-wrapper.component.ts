import { Component } from '@angular/core';

@Component({
  selector: 'app-visual-test-wrapper',
  templateUrl: './visual-test-wrapper.component.html',
  standalone: false
})
export class VisualTestWrapperComponent {
  readonly routes = [
    { path: '/visual/po-button-basic', label: 'po-button' },
    { path: '/visual/po-button-group-basic', label: 'po-button-group' },
    { path: '/visual/po-input-basic', label: 'po-input' },
    { path: '/visual/po-checkbox-basic', label: 'po-checkbox' },
    { path: '/visual/po-switch-basic', label: 'po-switch' },
    { path: '/visual/po-select-basic', label: 'po-select' },
    { path: '/visual/po-table-basic', label: 'po-table' },
    { path: '/visual/po-tag-basic', label: 'po-tag' },
    { path: '/visual/po-accordion-basic', label: 'po-accordion' },
    { path: '/visual/po-divider-basic', label: 'po-divider' },
    { path: '/visual/po-progress-basic', label: 'po-progress' }
  ];
}
