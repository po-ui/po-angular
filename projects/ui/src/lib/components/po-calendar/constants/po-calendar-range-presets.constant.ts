import { PoCalendarRangePreset } from '../interfaces/po-calendar-range-preset.interface';

function startOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function endOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
}

export const PO_CALENDAR_DEFAULT_RANGE_PRESETS: Array<PoCalendarRangePreset> = [
  {
    label: 'today',
    dateRange: (today: Date) => ({
      start: startOfDay(today),
      end: endOfDay(today)
    })
  },
  {
    label: 'yesterday',
    dateRange: (today: Date) => {
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      return {
        start: startOfDay(yesterday),
        end: endOfDay(yesterday)
      };
    }
  },
  {
    label: '7days',
    dateRange: (today: Date) => {
      const start = new Date(today);
      start.setDate(start.getDate() - 6);
      return {
        start: startOfDay(start),
        end: endOfDay(today)
      };
    }
  },
  {
    label: '14days',
    dateRange: (today: Date) => {
      const start = new Date(today);
      start.setDate(start.getDate() - 13);
      return {
        start: startOfDay(start),
        end: endOfDay(today)
      };
    }
  },
  {
    label: '30days',
    dateRange: (today: Date) => {
      const start = new Date(today);
      start.setDate(start.getDate() - 29);
      return {
        start: startOfDay(start),
        end: endOfDay(today)
      };
    }
  },
  {
    label: '3months',
    dateRange: (today: Date) => {
      const start = new Date(today);
      start.setMonth(start.getMonth() - 3);
      return {
        start: startOfDay(start),
        end: endOfDay(today)
      };
    }
  },
  {
    label: '6months',
    dateRange: (today: Date) => {
      const start = new Date(today);
      start.setMonth(start.getMonth() - 6);
      return {
        start: startOfDay(start),
        end: endOfDay(today)
      };
    }
  }
];
