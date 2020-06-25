import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { PoModalComponent, PoTableColumn, PoTableColumnSort, PoTableColumnLabel } from '@po-ui/ng-components';

import { SamplePoTableComponentsService } from './sample-po-table-components.service';
import { SamplePoTableComponentStatus } from './sample-po-table-components.enum';

@Component({
  selector: 'sample-po-table-components',
  templateUrl: './sample-po-table-components.component.html',
  styleUrls: ['./sample-po-table-components.component.css'],
  providers: [SamplePoTableComponentsService]
})
export class SamplePoTableComponentsComponent {
  extraInformation: any;
  items: Array<any> = this.sampleComponents.getItems();
  showMoreDisabled: boolean = false;
  title: any;
  isLoading: boolean = false;

  public readonly columns: Array<PoTableColumn> = [
    {
      property: 'status',
      type: 'label',
      width: '5%',
      labels: <Array<PoTableColumnLabel>>[
        {
          value: SamplePoTableComponentStatus.Stable,
          color: 'color-11',
          label: 'Stable',
          tooltip: 'Published component'
        },
        {
          value: SamplePoTableComponentStatus.Experimental,
          color: 'color-08',
          label: 'Experimental',
          tooltip: 'Component in homologation'
        },
        {
          value: SamplePoTableComponentStatus.RoadMap,
          color: 'color-07',
          label: 'Roadmap',
          tooltip: 'Component in roadmap'
        }
      ]
    },
    { property: 'component', type: 'link' },
    { property: 'type', label: 'Type', type: 'columnTemplate', width: '10%' },
    { property: 'description', color: this.experimentalColor.bind(this) },
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
    return row.status === SamplePoTableComponentStatus.Experimental ? 'color-08' : 'color-11';
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
    this.isLoading = true;
    this.showMoreDisabled = true;
    setTimeout(() => {
      this.items = this.getItems(sort);
      this.isLoading = false;
    }, 4000);
  }

  sort(sort: PoTableColumnSort) {
    this.items = this.getItems(sort);
  }

  private canGoToDocumentation(row) {
    return row.status !== SamplePoTableComponentStatus.Stable;
  }

  private canShowExtras(row: any) {
    return row.status !== SamplePoTableComponentStatus.Stable || row.extras.length === 0;
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

  public showAlert(msg): void {
    alert(msg);
  }
}
