import { FC, useEffect, useRef, useState } from 'react';

import styled from 'styled-components';

import CalendarHolidays from '../CalendarHolidays';
import CalendarTasks from '../CalendarTasks';
import { DayTasks } from '../../models/dayTasks.ts';
import { OnTaskDescriptionEdit } from '../Calendar';
import { Holiday } from '../../models/holiday.ts';
import { CalendarDayData } from '../../models/calendarDayData.ts';

const Wrapper = styled.div`
  width: 100%;
  flex-grow: 1;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
`;

const CalendarDay = styled.div`
  width: calc(100% / 7);
  padding: 10px;
  height: 170px;
  position: relative;
  border-top: 2px solid #f5f5f5;
  border-right: 2px solid #f5f5f5;
`;

const DayNumber = styled.div`
  right: 10px;
  color: #a6a6a6;
`;

const MonthDayNumber = styled.div`
  color: #000000;
`;

const CurrentDayNumber = styled.div`
  color: #cc0000;
  font-weight: bold;
`;

export interface TimeRangeCalendarDaysProps {
  draggingDay: string | undefined;
  date: Date;
  tasks: DayTasks[];
  onTaskAdd: (date: Date) => void;
  onTaskDescriptionEdit: OnTaskDescriptionEdit;
}

interface CalendarDaysProps extends Omit<TimeRangeCalendarDaysProps, 'tasks'> {
  days: CalendarDayData[];
}

const CalendarDays: FC<CalendarDaysProps> = ({
  days,
  draggingDay,
  date,
  onTaskAdd,
  onTaskDescriptionEdit,
}) => {
  const prevDate = useRef(date);

  const [holidays, setHolidays] = useState<Holiday[]>([]);

  useEffect(() => {
    (async () => {
      if (
        holidays.length > 0 &&
        prevDate.current?.getFullYear() === date.getFullYear()
      ) {
        return;
      }
      const response = await fetch(
        `/calendar/assets/holidays/${date.getFullYear()}.json`
      );

      setHolidays(await response.json());
    })();
  }, [date]);

  useEffect(() => {
    prevDate.current = date;
  }, [date]);

  return (
    <Wrapper>
      {days.map((day) => (
        <CalendarDay key={day.date.toString()}>
          {day.isCurrentDay ? (
            <CurrentDayNumber>{day.number}</CurrentDayNumber>
          ) : day.isCurrentMonth ? (
            <MonthDayNumber>{day.number}</MonthDayNumber>
          ) : (
            <DayNumber>{day.number}</DayNumber>
          )}
          <div>
            <CalendarHolidays
              holidays={holidays.filter(
                (h) =>
                  new Date(h.date).toJSON().slice(0, 10) ===
                  day.date.toJSON().slice(0, 10)
              )}
            />
            <CalendarTasks
              isDragging={draggingDay === day.date.toDateString()}
              date={day.date}
              tasks={day.tasks}
              onTaskAdd={onTaskAdd}
              onTaskDescriptionEdit={onTaskDescriptionEdit}
            />
          </div>
        </CalendarDay>
      ))}
    </Wrapper>
  );
};

export default CalendarDays;
