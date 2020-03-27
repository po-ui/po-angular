import { Injectable } from '@angular/core';

import { PoTableColumn, PoTableDetail } from '@po-ui/ng-components';

@Injectable()
export class SamplePoTableAirfareService {
  getColumns(): Array<PoTableColumn> {
    const airfareDetail: PoTableDetail = {
      columns: [
        { property: 'package' },
        { property: 'tour' },
        { property: 'time', label: 'Departure time', type: 'time', format: 'HH:mm' },
        { property: 'distance', label: 'Distance (Miles)', type: 'number', format: '1.0-5' }
      ],
      typeHeader: 'top'
    };

    return [
      {
        property: 'status',
        type: 'label',
        width: '100px',
        labels: [
          { value: 'available', color: 'color-11', label: 'Available' },
          { value: 'reserved', color: 'color-08', label: 'Reserved' },
          { value: 'closed', color: 'color-07', label: 'Closed' }
        ]
      },
      { property: 'country', width: '150px' },
      { property: 'destination', width: '150px' },
      {
        property: 'region',
        type: 'subtitle',
        width: '80px',
        subtitles: [
          { value: 'Alps', color: 'color-01', label: 'Alps', content: 'AL' },
          { value: 'Australasia', color: 'color-02', label: 'Australasia', content: 'AU' },
          { value: 'British Isle', color: 'color-03', label: 'British Isle', content: 'BI' },
          { value: 'Caucasus', color: 'color-04', label: 'Caucasus', content: 'CA' },
          { value: 'Danube', color: 'color-05', label: 'Danube', content: 'DA' },
          { value: 'East Asia', color: 'color-06', label: 'East Asia', content: 'EA' },
          { value: 'Latin America', color: 'color-07', label: 'Latin America', content: 'LA' },
          { value: 'Mediterranean', color: 'color-08', label: 'Mediterranean', content: 'ME' },
          { value: 'Nordics', color: 'color-09', label: 'Nordics', content: 'NO' },
          { value: 'North America', color: 'color-10', label: 'North America', content: 'NA' },
          { value: 'Southern Africa', color: 'color-11', label: 'Southern Africa', content: 'SA' },
          { value: 'Western Africa', color: 'color-12', label: 'Western Africa', content: 'WA' }
        ]
      },
      { property: 'date', type: 'date', width: '100px' },
      { property: 'returnDate', label: 'Return Date', type: 'date', width: '100px' },
      { property: 'id', label: 'Flight Number', type: 'number', width: '150px' },
      {
        property: 'onBoardService',
        label: 'On Board Service',
        type: 'boolean',
        width: '150px',
        boolean: {
          trueLabel: 'Yes',
          falseLabel: 'No'
        }
      },
      { property: 'value', type: 'currency', format: 'USD', width: '100px' },
      { property: 'detail', label: 'Details', type: 'detail', detail: airfareDetail }
    ];
  }

  getItems() {
    return [
      {
        id: 11234,
        initials: 'BR',
        country: 'Brazil',
        value: 1000.0,
        date: '2018-10-09',
        returnDate: '2018-11-01',
        class: 'Economic',
        onBoardService: false,
        destination: 'Rio de Janeiro',
        airline: 'Azul',
        status: 'available',
        region: 'Latin America',
        detail: [
          {
            package: 'Basic',
            tour: 'City tour by public bus and visit to the main museums.',
            time: '20:10:10',
            distance: '1000'
          },
          {
            package: 'Intermediary',
            tour: 'City tour by van and guided visit to the main museums.',
            time: '09:15:19',
            distance: '2000'
          },
          {
            package: 'Complete',
            tour: 'VIP city tour, music show with dinner and guided tour to the main museums.',
            time: '07:10:20',
            distance: '3000'
          }
        ]
      },
      {
        id: 22467,
        initials: 'FR',
        country: 'France',
        value: 5000.0,
        date: '2019-12-13',
        returnDate: '2019-12-31',
        class: 'Economic',
        onBoardService: false,
        destination: 'Paris',
        airline: 'British Airways',
        status: 'closed',
        region: 'Alps',
        detail: [
          {
            package: 'Basic',
            tour: 'City tour by public bus and visit to the main museums.',
            time: '10:15:10',
            distance: '4800'
          },
          {
            package: 'Intermediary',
            tour: 'City tour by van and guided visit to the main museums.',
            time: '22:15:10',
            distance: '11000'
          },
          {
            package: 'Complete',
            tour: 'VIP city tour, music show with dinner and guided tour to the main museums.',
            time: '10:15:10',
            distance: '1000'
          }
        ]
      },
      {
        id: 40670,
        initials: 'SN',
        country: 'Senegal',
        value: 3200.0,
        date: '2017-11-22',
        returnDate: '2018-12-01',
        class: 'Economic',
        onBoardService: false,
        destination: 'Dakar',
        airline: 'Iberia',
        status: 'closed',
        region: 'Western Africa'
      },
      {
        id: 34679,
        initials: 'PT',
        country: 'Portugal',
        value: 5500.0,
        date: '2017-10-10',
        returnDate: '2018-10-20',
        class: 'Economic',
        onBoardService: false,
        destination: 'Lisbon',
        airline: 'Air Europa',
        status: 'closed',
        region: 'Mediterranean'
      },
      {
        id: 48999,
        initials: 'RU',
        country: 'Russia',
        value: 6700.0,
        date: '2019-01-17',
        returnDate: '2019-02-20',
        class: 'First Class',
        onBoardService: true,
        destination: 'Moscow',
        airline: 'Lufthansa',
        status: 'reserved',
        region: 'Caucasus'
      },
      {
        id: 48999,
        initials: 'US',
        country: 'United States',
        value: 2700.49,
        date: '2018-10-17',
        returnDate: '2018-10-29',
        class: 'Economic',
        onBoardService: false,
        destination: 'Los Angeles',
        airline: 'American Airlines',
        status: 'reserved',
        region: 'North America'
      },
      {
        id: 54563,
        initials: 'CL',
        country: 'Chile',
        value: 2000.0,
        date: '2018-10-20',
        returnDate: '2018-11-01',
        destination: 'Cusco',
        class: 'Economic',
        onBoardService: false,
        airline: 'LATAM',
        status: 'available',
        region: 'Latin America'
      },
      {
        id: 64568,
        initials: 'MX',
        country: 'Mexico',
        value: 2100.0,
        date: '2018-03-10',
        returnDate: '2018-05-09',
        destination: 'Mexico City',
        class: 'Economic',
        onBoardService: false,
        airline: 'Aero México',
        status: 'available',
        region: 'Latin America',
        detail: [
          {
            package: 'Basic',
            tour: 'City tour by public bus and visit to the main museums.',
            time: '12:10:10',
            distance: '2200'
          },
          {
            package: 'Intermediary',
            tour: 'City tour by van and guided visit to the main museums.',
            time: '11:10:10',
            distance: '1500'
          },
          {
            package: 'Complete',
            tour: 'VIP city tour, music show with dinner and guided tour to the main museums.',
            time: '16:10:10',
            distance: '1800'
          }
        ]
      },
      {
        id: 75456,
        initials: 'IE',
        country: 'Ireland',
        value: 6300.0,
        date: '2018-10-14',
        returnDate: '2018-10-30',
        destination: 'Cork',
        class: 'First Class',
        onBoardService: true,
        airline: 'Lufthansa',
        status: 'reserved',
        region: 'British Isle'
      },
      {
        id: 23445,
        initials: 'ZA',
        country: 'South Africa',
        value: 1900.0,
        date: '2018-12-10',
        returnDate: '2018-12-25',
        destination: 'Cape Town',
        class: 'Economic',
        onBoardService: false,
        airline: 'South African Airways',
        status: 'available',
        region: 'Southern Africa'
      },
      {
        id: 19238,
        initials: 'AU',
        country: 'Australia',
        value: 6300.0,
        date: '2018-10-14',
        returnDate: '2018-10-30',
        destination: 'Sydney',
        class: 'First Class',
        onBoardService: true,
        airline: 'Jetstar Airways',
        status: 'reserved',
        region: 'Australasia'
      },
      {
        id: 85456,
        initials: 'JP',
        country: 'Japan',
        value: 5900.0,
        date: '2018-10-25',
        returnDate: '2018-11-10',
        destination: 'Tokio',
        class: 'Executive',
        onBoardService: true,
        airline: 'Japan Airlines',
        status: 'available',
        region: 'East Asia'
      },
      {
        id: 94565,
        initials: 'CN',
        country: 'China',
        value: 2900.0,
        date: '2018-10-10',
        returnDate: '2018-10-25',
        destination: 'Beijing',
        class: 'Economic',
        onBoardService: false,
        airline: 'Malaysia Airlines',
        status: 'available',
        region: 'East Asia'
      },
      {
        id: 32330,
        initials: 'UK',
        country: 'England',
        value: 2090.5,
        date: '2018-10-07',
        returnDate: '2018-11-15',
        destination: 'London',
        class: 'Executive',
        onBoardService: true,
        airline: 'British Airways',
        status: 'available',
        region: 'British Isle'
      },
      {
        id: 14560,
        initials: 'CA',
        country: 'Canada',
        value: 2090.5,
        date: '2018-10-07',
        returnDate: '2018-10-20',
        destination: 'Quebec',
        class: 'Economic',
        onBoardService: false,
        airline: 'American Airlines',
        status: 'available',
        region: 'North America'
      },
      {
        id: 93800,
        initials: 'IS',
        country: 'Iceland',
        value: 6300.0,
        date: '2018-10-12',
        returnDate: '2018-10-27',
        destination: 'Reykjavík',
        class: 'Economic',
        onBoardService: false,
        airline: 'Star Alliance',
        status: 'available',
        region: 'Nordics'
      },
      {
        id: 34239,
        initials: 'DE',
        country: 'Germany',
        value: 3070.5,
        date: '2018-10-07',
        returnDate: '2018-10-20',
        destination: 'Berlin',
        class: 'Executive',
        onBoardService: true,
        airline: 'LATAM',
        status: 'available',
        region: 'Danube'
      },
      {
        id: 45611,
        initials: 'AR',
        country: 'Argentina',
        value: 3500.5,
        date: '2018-12-07',
        returnDate: '2018-12-29',
        destination: 'Ushuaia',
        class: 'Economic',
        onBoardService: false,
        airline: 'LATAM',
        status: 'reserved',
        region: 'Latin America'
      }
    ];
  }
}
