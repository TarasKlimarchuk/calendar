import { FC, useMemo } from 'react';

import CalendarDays, { TimeRangeCalendarDaysProps } from '../CalendarDays';
import { getCalendarDayData } from '../../utils/getCalendarDayData.ts';

const MonthCalendarDays: FC<TimeRangeCalendarDaysProps> = ({
  draggingDay,
  date,
  tasks,
  onTaskAdd,
  onTaskDescriptionEdit,
}) => {
  const days = useMemo(() => {
    const currentDay = new Date(date.getFullYear(), date.getMonth(), 1);
    const weekdayOfFirstDay = currentDay.getDay();
    const currentDays = [];

    for (let day = 0; day < 42; day++) {
      if (day === 0 && weekdayOfFirstDay === 0) {
        currentDay.setDate(currentDay.getDate() - 7);
      } else if (day === 0) {
        currentDay.setDate(currentDay.getDate() + (day - weekdayOfFirstDay));
      } else {
        currentDay.setDate(currentDay.getDate() + 1);
      }

      const calendarDay = getCalendarDayData({
        calendarDate: date,
        currentDay,
        tasks,
      });

      currentDays.push(calendarDay);
    }

    return currentDays;
  }, [date, tasks]);

  return (
    <CalendarDays
      date={date}
      days={days}
      draggingDay={draggingDay}
      onTaskAdd={onTaskAdd}
      onTaskDescriptionEdit={onTaskDescriptionEdit}
    />
  );
};

export default MonthCalendarDays;
