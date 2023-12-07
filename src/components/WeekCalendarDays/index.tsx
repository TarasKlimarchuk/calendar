import { FC, useMemo } from 'react';
import { addDays, startOfWeek } from 'date-fns';

import CalendarDays, { TimeRangeCalendarDaysProps } from '../CalendarDays';
import { getCalendarDayData } from '../../utils/getCalendarDayData.ts';

const WeekCalendarDays: FC<TimeRangeCalendarDaysProps> = ({
  date,
  tasks,
  onTaskAdd,
  onTaskDescriptionEdit,
  draggingDay,
}) => {
  const days = useMemo(() => {
    const currentDay = startOfWeek(date);
    const currentDays = [];

    for (let day = 0; day < 7; day++) {
      const weekDay = addDays(currentDay, day);
      const calendarDay = getCalendarDayData({
        calendarDate: date,
        currentDay: weekDay,
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

export default WeekCalendarDays;
