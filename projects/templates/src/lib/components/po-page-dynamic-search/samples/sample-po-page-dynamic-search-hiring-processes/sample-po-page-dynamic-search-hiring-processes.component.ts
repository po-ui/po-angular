import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { PoPageDynamicSearchLiterals, PoPageDynamicSearchFilters } from '@po-ui/ng-templates';

import {
  PoBreadcrumb,
  PoPageAction,
  PoDialogService,
  PoNotificationService,
  PoTableColumn,
  PoSelectOption
} from '@po-ui/ng-components';

import { SamplePoPageDynamicSearchHiringProcessesService } from './sample-po-page-dynamic-search-hiring-processes.service';

@Component({
  selector: 'sample-po-page-dynamic-search-hiring-processes',
  templateUrl: './sample-po-page-dynamic-search-hiring-processes.component.html',
  providers: [SamplePoPageDynamicSearchHiringProcessesService]
})
export class SamplePoPageDynamicSearchHiringProcessesComponent implements OnInit {
  hiringProcesses: Array<object>;
  hiringProcessesColumns: Array<PoTableColumn>;
  quickSearchWidth: number = 6;
  hideRemoveAllDisclaimer = false;
  hideCloseDisclaimers: Array<string> = ['city'];

  public readonly actions: Array<PoPageAction> = [
    { label: 'Hire', action: this.hireCandidate.bind(this), disabled: this.disableHireButton.bind(this) },
    { label: 'Find on Google', action: this.findOnGoogle.bind(this), disabled: true },
    {
      label: 'Hide Remove All Disclaimer',
      action: this.onClickRemoveAllDisclaimer.bind(this),
      visible: this.isVisibleRemoveAllDisclaimer.bind(this),
      icon: 'po-icon-eye-off'
    },
    {
      label: 'Show Remove All Disclaimer',
      action: this.onClickRemoveAllDisclaimer.bind(this),
      visible: this.isHideRemoveAllDisclaimer.bind(this),
      icon: 'po-icon-eye-on'
    },
    {
      label: 'Hide Close City Disclaimer',
      action: this.onClickCloseCityDisclaimer.bind(this),
      visible: this.isVisibleCloseCityDisclaimer.bind(this),
      icon: 'po-icon-eye-off'
    },
    {
      label: 'Show Close City Disclaimer',
      action: this.onClickCloseCityDisclaimer.bind(this),
      visible: this.isHideCloseCityDisclaimer.bind(this),
      icon: 'po-icon-eye-on'
    }
  ];

  public readonly breadcrumb: PoBreadcrumb = {
    items: [{ label: 'Home', action: this.beforeRedirect.bind(this) }, { label: 'Hiring processes' }]
  };

  readonly literals: PoPageDynamicSearchLiterals = {
    filterConfirmLabel: 'Aplicar',
    filterTitle: 'Filtro avançado',
    quickSearchLabel: 'Valor pesquisado:'
  };

  private jobDescriptionOptions: Array<PoSelectOption> = [];
  private statusOptions: Array<PoSelectOption> = [];

  // eslint-disable-next-line @typescript-eslint/member-ordering
  public readonly filters: Array<PoPageDynamicSearchFilters> = [
    { property: 'hireStatus', label: 'Hire Status', options: this.statusOptions, gridColumns: 6 },
    { property: 'name', gridColumns: 6 },
    { property: 'city', gridColumns: 6 },
    { property: 'job', label: 'Job Description', options: this.jobDescriptionOptions, gridColumns: 6 }
  ];

  constructor(
    private sampleHiringProcessesService: SamplePoPageDynamicSearchHiringProcessesService,
    private poNotification: PoNotificationService,
    private poDialog: PoDialogService,
    private router: Router
  ) {}

  ngOnInit() {
    this.hiringProcesses = this.sampleHiringProcessesService.getItems();
    this.hiringProcessesColumns = this.sampleHiringProcessesService.getColumns();
    this.jobDescriptionOptions = this.sampleHiringProcessesService.getJobs();
    this.statusOptions = this.sampleHiringProcessesService.getHireStatus();

    this.updateFilters();
  }

  onAdvancedSearch(filter) {
    filter ? this.searchItems(filter) : this.resetFilters();
  }

  onChangeDisclaimers(disclaimers) {
    const filter = {};
    disclaimers.forEach(item => {
      filter[item.property] = item.value;
    });
    this.searchItems(filter);
  }

  onQuickSearch(filter) {
    filter ? this.searchItems({ name: filter }) : this.resetFilters();
  }

  onLoadFields() {
    return this.sampleHiringProcessesService.getPageOptions();
  }

  private beforeRedirect(itemBreadcrumbLabel) {
    if (this.hiringProcesses.some(candidate => candidate['$selected'])) {
      this.poDialog.confirm({
        title: `Confirm redirect to ${itemBreadcrumbLabel}`,
        message: `There is data selected. Are you sure you want to quit?`,
        confirm: () => this.router.navigate(['/'])
      });
    } else {
      this.router.navigate(['/']);
    }
  }

  private disableHireButton() {
    return !this.hiringProcesses.find(candidate => candidate['$selected']);
  }

  private hireCandidate() {
    const hired = '1';
    const progress = '2';
    const canceled = '3';

    const selectedCandidate = this.hiringProcesses.find(candidate => candidate['$selected']);
    switch (selectedCandidate['hireStatus']) {
      case progress:
        selectedCandidate['hireStatus'] = 'hired';
        this.poNotification.success('Hired candidate!');
        break;

      case hired:
        this.poNotification.warning('This candidate has already been hired.');
        break;

      case canceled:
        this.poNotification.error('This candidate has already been disqualified.');
        break;
    }
  }

  private resetFilters() {
    this.hiringProcesses = this.sampleHiringProcessesService.resetFilterHiringProcess();
  }

  private searchItems(filter) {
    this.hiringProcesses = this.sampleHiringProcessesService.filter(filter);
  }

  private updateFilters() {
    this.filters[0].options = this.statusOptions;
    this.filters[3].options = this.jobDescriptionOptions;
  }

  private findOnGoogle() {
    const selectedItem = this.hiringProcesses.find(item => item['$selected']);
    const jobDescription = selectedItem ? selectedItem['jobDescription'] : '';
    window.open(`http://google.com/search?q=${jobDescription}`, '_blank');
  }

  private onClickRemoveAllDisclaimer() {
    this.hideRemoveAllDisclaimer = !this.hideRemoveAllDisclaimer;
  }

  private isVisibleRemoveAllDisclaimer() {
    return !this.hideRemoveAllDisclaimer;
  }

  private isHideRemoveAllDisclaimer() {
    return this.hideRemoveAllDisclaimer;
  }

  private onClickCloseCityDisclaimer() {
    if (this.hideCloseDisclaimers.length > 0) {
      this.hideCloseDisclaimers = [];
    } else {
      this.hideCloseDisclaimers = ['city'];
    }
  }

  private isVisibleCloseCityDisclaimer() {
    return this.hideCloseDisclaimers.length <= 0;
  }

  private isHideCloseCityDisclaimer() {
    return this.hideCloseDisclaimers.length > 0;
  }
}
