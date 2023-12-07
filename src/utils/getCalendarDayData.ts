import { CalendarDayData } from '../models/calendarDayData.ts';
import { DayTasks } from '../models/dayTasks.ts';

export const getCalendarDayData = ({
  calendarDate,
  currentDay,
  tasks,
}: {
  calendarDate: Date;
  currentDay: Date;
  tasks: DayTasks[];
}): CalendarDayData => ({
  date: new Date(currentDay),
  isCurrentMonth: currentDay.getMonth() === calendarDate.getMonth(),
  isCurrentDay: currentDay.toDateString() === new Date().toDateString(),
  number: currentDay.getDate(),
  tasks:
    tasks.find((t) => t.date.toDateString() === currentDay.toDateString())
      ?.tasks || [],
});
