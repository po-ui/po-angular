import {
  PoCheckboxGroupOption,
  PoRadioGroupOption,
  PoSearchComponent,
  PoSearchFilterMode,
  PoSearchLiterals
} from '@po-ui/ng-components';
import { Component, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'sample-po-search-labs',
  templateUrl: './sample-po-search-labs.component.html',
  styles: [
    `
      .sample-list-search {
        list-style: none;
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        grid-gap: 1rem;
      }

      .sample-list-search strong {
        text-transform: capitalize;
      }
    `
  ]
})
export class SamplePoSearchLabsComponent implements OnInit, OnChanges {
  @ViewChild('poSearch', { static: true }) PoSearch: PoSearchComponent;

  customLiterals: PoSearchLiterals;
  literals: any;
  properties: Array<string>;
  search: string;
  event: string;
  service: string = 'https://po-sample-api.onrender.com/v1/heroes';
  items: Array<any> = [];
  filteredItems: Array<any> = [];
  fieldKeys: Array<any> = [];
  tooltip: string;
  icon: string;
  filterMode: PoSearchFilterMode;
  searchMode = 'action';
  fieldKey: any;
  itemsModel: any;
  filterModel: any;

  public readonly propertiesOptions: Array<PoCheckboxGroupOption> = [{ value: 'disabled', label: 'Disabled' }];

  public readonly iconsOptions: Array<PoRadioGroupOption> = [
    { label: 'fa-search', value: 'fa fa-search' },
    { label: 'ph-magnifying-glass', value: 'ph ph-magnifying-glass' }
  ];

  public readonly filterModeOptions: Array<PoRadioGroupOption> = [
    { label: 'Starts With', value: PoSearchFilterMode.startsWith },
    { label: 'Contains', value: PoSearchFilterMode.contains },
    { label: 'Ends With', value: PoSearchFilterMode.endsWith }
  ];

  public readonly searchModeOptions: Array<PoRadioGroupOption> = [
    { label: 'Action', value: 'action' },
    { label: 'Trigger', value: 'trigger' }
  ];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.restore();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['items']) {
      this.filteredItems = this.items;
    }
  }

  changeFilter(item: any) {
    return Object.keys(item);
  }

  onChangeService() {
    this.http.get(this.service).subscribe((response: any) => {
      const items = response.items;
      if (items && items.length > 0) {
        this.items = items;
        this.filteredItems = items;
        this.fieldKeys = ['name'];
      }
    });
  }

  updateFilterKeys(event: string) {
    this.fieldKeys = this.convertToArray(event);
  }

  filter(event: Array<any>) {
    this.filteredItems = event;

    if (event.length === 0) {
      this.event = 'p-change-model';
      return;
    }

    this.event = 'p-filtered-items-change';
  }

  changeItems(items: any) {
    try {
      const new_items: Array<{}> = JSON.parse(items);

      if (Array.isArray(new_items)) {
        this.filteredItems = new_items;
        this.items = new_items;
      }
    } catch (error) {}
  }

  propertiesChange(event) {
    this.properties = event;
  }

  changeLiterals() {
    try {
      this.customLiterals = JSON.parse(this.literals);
    } catch {
      this.customLiterals = undefined;
    }
  }

  changeModel(event: string) {
    this.search = event;
    if (this.event.length === 0) {
      this.event = 'p-change-model';
    }

    if (event.length === 0) {
      this.search = '';
      this.event = '';
    }
  }

  restore() {
    this.search = '';
    this.event = '';
    this.icon = undefined;
    this.customLiterals = undefined;
    this.properties = [];
    this.filteredItems = undefined;
    this.items = undefined;
    this.itemsModel = undefined;
    this.filterModel = '["name"]';
    this.fieldKeys = undefined;
    this.filterMode = PoSearchFilterMode.startsWith;
    this.searchMode = 'action';
    this.literals = undefined;
    this.cleanInput();
    this.onChangeService();
  }

  cleanInput() {
    try {
      this.PoSearch.clearSearch();
    } catch (error) {}
  }

  private convertToArray(value: string): Array<any> {
    try {
      return JSON.parse(value);
    } catch {
      return undefined;
    }
  }
}
