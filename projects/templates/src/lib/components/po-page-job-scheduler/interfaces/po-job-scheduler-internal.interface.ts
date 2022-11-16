export interface PoJobSchedulerInternal {
  [property: string | number]: any;

  dayOfMonth?: number;

  frequency?: object;

  rangeLimitHour?: string;

  rangeLimitDay?: number;

  daysOfWeek?: Array<string>;

  executionParameter?: object;

  firstExecution: Date;

  firstExecutionHour: string;

  hour?: string;

  periodicity: string;

  processID?: string;

  recurrent: boolean;
}
