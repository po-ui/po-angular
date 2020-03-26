import { Component, Input, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';

import { PoDynamicViewField, PoInfoOrientation } from '@po-ui/ng-components';

import { PoJobSchedulerInternal } from '../interfaces/po-job-scheduler-internal.interface';

@Component({
  selector: 'po-page-job-scheduler-summary',
  templateUrl: 'po-page-job-scheduler-summary.component.html'
})
export class PoPageJobSchedulerSummaryComponent implements OnInit {
  executionValue = '';
  firstExecutionValue = '';
  infoOrientation = PoInfoOrientation.Horizontal;
  periodicityValue = '';
  recurrentValue = '';

  @Input('p-literals') literals = <any>{};

  @Input('p-parameters') parameters: Array<PoDynamicViewField> = [];

  @Input('p-value') value: PoJobSchedulerInternal = <any>{};

  constructor(private datePipe: DatePipe) {}

  ngOnInit() {
    const { periodicity, hour, dayOfMonth, daysOfWeek, recurrent, firstExecution, firstExecutionHour } = this.value;

    this.periodicityValue = this.getPeriodicityLabel(periodicity);
    this.executionValue = this.getExecutionValue(periodicity, hour, daysOfWeek, dayOfMonth);
    this.firstExecutionValue = this.getFirstExecutionLabel(firstExecution, firstExecutionHour);
    this.recurrentValue = this.getRecurrentValue(recurrent);
  }

  private getExecutionValue(periodicity: string, hour?: string, daysOfWeek?: Array<string>, dayOfMonth?: number) {
    switch (periodicity) {
      case 'daily':
        return this.getHourLabel(hour);
      case 'monthly':
        return this.getMonthlyLabelExecution(dayOfMonth, hour);
      case 'weekly':
        return this.getWeeklyLabelExecution(daysOfWeek, hour);
      default:
        return this.literals.notReported;
    }
  }

  private getFirstExecutionLabel(firstExecution: Date, firstExecutionHour?: string): string {
    if (firstExecution) {
      const date = this.datePipe.transform(firstExecution, 'dd/MM/yyyy', '-0200');

      return `${date} ${this.getHourLabel(firstExecutionHour)}`;
    } else {
      return this.literals.notReported;
    }
  }

  private getHourLabel(hour: string) {
    return `${this.literals.at} ${hour || '00:00'}h`;
  }

  private getMonthlyLabelExecution(dayOfMonth: number, hour: string) {
    const hourLabel = this.getHourLabel(hour);

    return `${this.literals.day} ${dayOfMonth} ${hourLabel}`;
  }

  private getPeriodicityLabel(periodicity) {
    switch (periodicity) {
      case 'daily':
        return this.literals.daily;
      case 'monthly':
        return this.literals.monthly;
      case 'weekly':
        return this.literals.weekly;
      default:
        return this.literals.single;
    }
  }

  private getRecurrentValue(recurrent: boolean): string {
    return recurrent ? this.literals.yes : this.literals.no;
  }

  private getSorterWeekDays() {
    return {
      'sunday': 0,
      'monday': 1,
      'tuesday': 2,
      'wednesday': 3,
      'thursday': 4,
      'friday': 5,
      'saturday': 6
    };
  }

  private getTranslateWeekDay(day: string): string {
    const days = {
      Sunday: this.literals.sunday,
      Monday: this.literals.monday,
      Tuesday: this.literals.tuesday,
      Wednesday: this.literals.wednesday,
      Thursday: this.literals.thursday,
      Friday: this.literals.friday,
      Saturday: this.literals.saturday
    };

    return days[day] || '';
  }

  private getWeekDaysLabel(days: Array<string> = []): string {
    const weekDaysSorted = this.sortWeekDays(days);

    return weekDaysSorted.map(day => this.getTranslateWeekDay(day)).join(', ');
  }

  private getWeeklyLabelExecution(daysOfWeek: Array<string>, hour: string) {
    if (daysOfWeek && Array.isArray(daysOfWeek)) {
      return `${this.getWeekDaysLabel(daysOfWeek)} ${this.getHourLabel(hour)}`;
    } else {
      return this.literals.notReported;
    }
  }

  private sortWeekDays(days: Array<string> = []) {
    const sorterWeekDays = this.getSorterWeekDays();

    return days.sort((a: string, b: string) => {
      const currDay = a.toLowerCase();
      const nextDay = b.toLowerCase();

      return sorterWeekDays[currDay] > sorterWeekDays[nextDay] ? 1 : -1;
    });
  }
}
