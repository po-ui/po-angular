import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { PoModalComponent, PoTableColumn, PoTableColumnSort } from '@portinari/portinari-ui';

import { SamplePoTableComponentsService } from './sample-po-table-components.service';

@Component({
  selector: 'sample-po-table-components',
  templateUrl: './sample-po-table-components.component.html',
  providers: [SamplePoTableComponentsService]
})
export class SamplePoTableComponentsComponent {
  extraInformation: any;
  items: Array<any> = this.sampleComponents.getItems();
  showMoreDisabled: boolean = false;
  title: any;

  public readonly columns: Array<PoTableColumn> = [
    {
      property: 'status',
      type: 'label',
      width: '5%',
      labels: [
        { value: 'stable', color: 'color-11', label: 'Stable', tooltip: 'Published component' },
        { value: 'experimental', color: 'color-08', label: 'Experimental', tooltip: 'Component in homologation' },
        { value: 'roadmap', color: 'color-07', label: 'Roadmap', tooltip: 'Component in roadmap' }
      ]
    },
    { property: 'component', type: 'link' },
    { property: 'description', color: this.experimentalColor },
    {
      property: 'extra',
      label: 'Extras',
      type: 'link',
      tooltip: 'Additional details',
      action: (value, row) => {
        this.extras(value, row);
      },
      disabled: this.canShowExtras.bind(this)
    },
    {
      property: 'favorite',
      label: 'Actions',
      type: 'icon',
      icons: [
        {
          action: this.favorite.bind(this),
          color: this.isFavorite.bind(this),
          icon: 'po-icon-star',
          tooltip: 'Favorite',
          value: 'favorite'
        },
        {
          action: this.goToDocumentation.bind(this),
          disabled: this.canGoToDocumentation.bind(this),
          icon: 'po-icon-export',
          tooltip: 'Click to go to documentation',
          value: 'documentation'
        }
      ]
    }
  ];

  @ViewChild(PoModalComponent, { static: true }) poModal: PoModalComponent;

  constructor(public sampleComponents: SamplePoTableComponentsService, private router: Router) {}

  experimentalColor(row) {
    return row.status === 'experimental' ? 'color-08' : 'color-11';
  }

  extras(value, row) {
    this.title = value;
    this.extraInformation = row;

    this.poModal.open();
  }

  goToDocumentation(row) {
    this.router.navigate([row.link]);
  }

  showMore(sort: PoTableColumnSort) {
    this.showMoreDisabled = true;
    this.items = this.getItems(sort);
  }

  sort(sort: PoTableColumnSort) {
    this.items = this.getItems(sort);
  }

  private canGoToDocumentation(row) {
    return row.status !== 'stable';
  }

  private canShowExtras(row: any) {
    if (row.status) {
      return row.status !== 'stable';
    }
  }

  private favorite(row) {
    row.isFavorite = !row.isFavorite;
  }

  private getItems(sort: PoTableColumnSort) {
    return this.sampleComponents.getItems(sort, this.showMoreDisabled);
  }

  private isFavorite(row) {
    return row.isFavorite ? 'color-08' : 'color-11';
  }
}
