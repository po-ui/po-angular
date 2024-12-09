import { HttpClient } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { PoComboOption, PoNotificationService, PoSearchComponent, PoSearchFilterMode } from '../../../../ui/src/lib';

@Component({
  selector: 'app-icons',
  templateUrl: './icons.component.html',
  styleUrls: ['icons.component.css'],
  standalone: false
})
export class IconsComponent {
  @ViewChild('poSearch', { static: true }) PoSearch: PoSearchComponent;

  // TYPE
  iconType = 'regular';
  iconTypeOptions: Array<PoComboOption> = [
    { label: 'Regular', value: 'regular' },
    { label: 'Fill', value: 'fill' }
  ];
  // FILTER
  iconFilterType: PoSearchFilterMode = PoSearchFilterMode.contains;
  iconFilterKeys: Array<string> = ['tags'];

  // ICONS
  iconsItems;
  filteredItems = [];

  loading: boolean = true;

  constructor(
    private http: HttpClient,
    public poNotification: PoNotificationService
  ) {
    this.poNotification.setDefaultDuration(2000);
    this.changeIconType();
  }

  onTypeChange() {
    this.changeIconType();
    this.PoSearch.clearSearch();
  }

  changeIconType() {
    this.loading = true;

    this.http.get(`assets/json/icons-${this.iconType}.json`).subscribe((data: any) => {
      const isFill = this.iconType === 'fill';
      this.iconsItems = data.icons.map(e => {
        const _iconTags = e.properties.name.replace('-fill', '');
        const _iconName = e.properties.ligatures ? e.properties.ligatures.replace('-fill', '') : _iconTags;
        return {
          value: _iconName,
          tags: _iconTags,
          code: `ph${isFill ? '-fill' : ''} ph-${_iconName}`
        };
      });

      this.filteredItems = this.iconsItems;
      this.loading = false;
    });
  }

  filter(event: any) {
    this.filteredItems = event;
  }

  copyClipboard(code: string) {
    navigator.clipboard.writeText(code);
    this.poNotification.information(`Ícone copiado: '${code}'`);
  }
}
