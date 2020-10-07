import { Component } from '@angular/core';

import {
  PoChartGaugeSerie,
  PoChartType,
  PoDialogService,
  PoDonutChartSeries,
  PoLineChartSeries,
  PoPieChartSeries,
  PoChartOptions
} from '@po-ui/ng-components';

@Component({
  selector: 'sample-po-chart-coffee-ranking',
  templateUrl: './sample-po-chart-coffee-ranking.component.html'
})
export class SamplePoChartCoffeeRankingComponent {
  brazilianCoffeeProduction: PoChartGaugeSerie = {
    value: 33,
    description: `of world's coffee beans were produced in Brazil`
  };

  brazilianCoffeeProductionChartType: PoChartType = PoChartType.Gauge;
  participationByCountryInWorldExportsType: PoChartType = PoChartType.Line;
  coffeConsumingChartType: PoChartType = PoChartType.Donut;

  categories: Array<string> = ['2010', '2011', '2012', '2013', '2014', '2015'];

  coffeeConsumption: Array<PoDonutChartSeries> = [
    { category: 'Finland', value: 9.6, tooltip: 'Finland (Europe)' },
    { category: 'Norway', value: 7.2, tooltip: 'Norway (Europe)' },
    { category: 'Netherlands', value: 6.7, tooltip: 'Netherlands (Europe)' },
    { category: 'Slovenia', value: 6.1, tooltip: 'Slovenia (Europe)' },
    { category: 'Austria', value: 5.5, tooltip: 'Austria (Europe)' }
  ];

  participationByCountryInWorldExports: Array<PoLineChartSeries> = [
    { label: 'Brazil', data: [35, 32, 25, 29, 33, 33] },
    { label: 'Vietnam', data: [15, 17, 23, 19, 22, 18] },
    { label: 'Colombia', data: [8, 7, 6, 9, 10, 11] },
    { label: 'India', data: [5, 6, 5, 4, 5, 5] },
    { label: 'Indonesia', data: [7, 6, 10, 10, 4, 6] }
  ];

  coffeeProduction: Array<PoPieChartSeries> = [
    { category: 'Brazil', value: 2796, tooltip: 'Brazil (South America)' },
    { category: 'Vietnam', value: 1076, tooltip: 'Vietnam (Asia)' },
    { category: 'Colombia', value: 688, tooltip: 'Colombia (South America)' },
    { category: 'Indonesia', value: 682, tooltip: 'Indonesia (Asia/Oceania)' },
    { category: 'Peru', value: 273, tooltip: 'Peru (South America)' }
  ];

  items: Array<any> = [
    { position: '1', company: 'Tim Hortons', location: 'Hamilton, Ontario, Canada', foundation: '1964' },
    { position: '2', company: 'Bewley’s', location: 'Dublin, Ireland', foundation: '1840' },
    { position: '3', company: 'Lavazza Coffee', location: 'Italy', foundation: '1895' },
    { position: '4', company: 'Peet’s Tea and Coffee', location: 'Emeryville, California, US', foundation: '1966' },
    { position: '5', company: 'Tully’s Coffee', location: 'Seattle, Washington, US', foundation: '1992' },
    { position: '6', company: 'Costa Coffee', location: 'Dunstable, England', foundation: '1971' },
    { position: '7', company: 'McCafe', location: 'Oak Brook, Illinois, United States', foundation: '1993' },
    { position: '8', company: 'Starbucks Coffee', location: 'Seattle, Washington, US', foundation: '1971' },
    { position: '9', company: 'Dunkin’ Donuts', location: 'Quincy, Massachusetts, US', foundation: '1950' },
    { position: '10', company: 'Coffee Beanery', location: 'Flushing, Michigan, US', foundation: '1976' }
  ];

  options: PoChartOptions = {
    axis: {
      minRange: 0,
      maxRange: 40,
      axisXGridLines: 5
    }
  };

  constructor(private poAlert: PoDialogService) {}

  searchMore(event: any) {
    window.open(`http://google.com/search?q=coffee+producing+${event.category}`, '_blank');
  }

  showMeTheDates(event: any) {
    this.poAlert.alert({
      title: 'Statistic',
      message: `${event.category} consuming ${event.value}kg per capita!`,
      ok: () => {}
    });
  }
}
