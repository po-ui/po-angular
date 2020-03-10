import { PoJobSchedulerInternal } from './interfaces/po-job-scheduler-internal.interface';

export class PoPageJobSchedulerInternal implements PoJobSchedulerInternal {
  periodicity = 'single';
  firstExecution = new Date();
  firstExecutionHour = this.getCurrentHour(this.firstExecution);
  recurrent = true;

  private getCurrentHour(date: Date): string {
    const hours = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
    const minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();

    return `${hours}:${minutes}`;
  }
}
