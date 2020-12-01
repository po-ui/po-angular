import { Injectable } from '@angular/core';

import { PoTableColumn } from '@po-ui/ng-components';

@Injectable()
export class SamplePoPageDynamicSearchHiringProcessesService {
  filter(filters) {
    let filteredItems = [...this.getItems()];

    Object.keys(filters).forEach(filter => {
      filteredItems = filteredItems.filter(register => {
        return register[filter].toLocaleLowerCase().includes(filters[filter].toLocaleLowerCase());
      });
    });

    return filteredItems;
  }

  getColumns(): Array<PoTableColumn> {
    return [
      {
        property: 'hireStatus',
        label: 'Status',
        type: 'subtitle',
        subtitles: [
          { value: '1', color: 'success', label: 'Hired', content: '1' },
          { value: '2', color: 'warning', label: 'Progress', content: '2' },
          { value: '3', color: 'danger', label: 'Canceled', content: '3' }
        ]
      },
      { property: 'idCard', label: 'Identity card', type: 'string' },
      { property: 'name', label: 'Name' },
      { property: 'age', label: 'Age' },
      { property: 'city', label: 'City' },
      { property: 'jobDescription', label: 'Job description', type: 'string' }
    ];
  }

  getHireStatus() {
    return [
      { value: '1', label: 'Hired' },
      { value: '2', label: 'Progress' },
      { value: '3', label: 'Canceled' }
    ];
  }

  getItems() {
    return [
      {
        hireStatus: '1',
        name: 'James Johnson',
        city: 'Ontario',
        age: 24,
        idCard: 'AB34lxi90',
        job: 'abc',
        jobDescription: 'Systems Analyst'
      },
      {
        hireStatus: '2',
        name: 'Brian Brown',
        city: 'Buffalo',
        age: 23,
        idCard: 'HG56lds54',
        job: 'def',
        jobDescription: 'Trainee'
      },
      {
        hireStatus: '3',
        name: 'Mary Davis',
        city: 'Albany',
        age: 31,
        idCard: 'DF23cfr65',
        job: 'ghi',
        jobDescription: 'Programmer'
      },
      {
        hireStatus: '1',
        name: 'Margaret Garcia',
        city: 'New York',
        age: 29,
        idCard: 'GF45fgh34',
        job: 'jkl',
        jobDescription: 'Web developer'
      },
      {
        hireStatus: '1',
        name: 'Emma Hall',
        city: 'Ontario',
        age: 34,
        idCard: 'RF76jut21',
        job: 'mno',
        jobDescription: 'Recruiter'
      },
      {
        hireStatus: '2',
        name: 'Lucas Clark',
        city: 'Utica',
        age: 32,
        idCard: 'HY21kgu65',
        job: 'pqr',
        jobDescription: 'Consultant'
      },
      {
        hireStatus: '1',
        name: 'Ella Scott',
        city: 'Ontario',
        age: 24,
        idCard: 'UL78flg68',
        job: 'stu',
        jobDescription: 'DBA'
      },
      {
        hireStatus: '2',
        name: 'Chloe Walker',
        city: 'Albany',
        age: 29,
        idCard: 'JH12oli98',
        job: 'ghi',
        jobDescription: 'Programmer'
      }
    ];
  }

  getJobs() {
    return [
      { value: 'abc', label: 'Systems Analyst' },
      { value: 'def', label: 'Trainee' },
      { value: 'ghi', label: 'Programmer' },
      { value: 'jkl', label: 'Web developer' },
      { value: 'mno', label: 'Recruiter' },
      { value: 'pqr', label: 'Consultant' },
      { value: 'stu', label: 'DBA' }
    ];
  }

  resetFilterHiringProcess() {
    return [...this.getItems()];
  }

  getPageOptions() {
    return {
      actions: [{ label: 'Find on Google', disabled: false }],
      filters: [
        { property: 'idCard', gridColumns: 6 },
        { property: 'city', initValue: 'Ontario' }
      ],
      keepFilters: true
    };
  }
}
