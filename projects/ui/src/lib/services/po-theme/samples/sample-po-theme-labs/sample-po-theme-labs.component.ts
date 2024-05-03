import { Component, OnInit } from '@angular/core';

import { PoRadioGroupOption, PoTheme, PoThemeService, PoThemeTypeEnum } from '@po-ui/ng-components';

@Component({
  selector: 'sample-po-theme-labs',
  templateUrl: './sample-po-theme-labs.component.html',
  providers: [PoThemeService]
})
export class SamplePoThemeLabsComponent implements OnInit {
  theme: string;
  type: boolean;

  public readonly themeOptions: Array<PoRadioGroupOption> = [{ label: 'Default (PO-UI)', value: 'default' }];

  constructor(private poTheme: PoThemeService) {}

  ngOnInit(): void {
    this.poTheme.persistThemeActive();
  }

  restore() {
    this.theme = 'default';
    this.type = false;
    this.poTheme.cleanThemeActive();
  }

  changeTheme() {
    if (this.theme === 'default') {
      this.poTheme.setDefaultTheme(this.type ? PoThemeTypeEnum.dark : PoThemeTypeEnum.light);
    }
  }

  getSavedTheme() {
    const theme: PoTheme = this.poTheme.persistThemeActive();
    this.type = theme.active === PoThemeTypeEnum.light ? false : true;
    this.theme = theme.name;
  }
}
