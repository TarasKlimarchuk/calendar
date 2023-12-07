import { DayTasks } from './dayTasks.ts';

export interface CalendarDayData {
  date: Date;
  number: number;
  isCurrentMonth: boolean;
  isCurrentDay: boolean;
  tasks: DayTasks['tasks'];
}
