import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  templateUrl: './ia-tools-mcp.component.html',
  styles: [
    `
      ul {
        margin-left: 24px;
      }

      li {
        margin-left: 16px;
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false
})
export class IaToolsMcpComponent {}
