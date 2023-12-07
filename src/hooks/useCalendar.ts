import { useState } from 'react';
import { addMonths, addWeeks, subMonths, subWeeks } from 'date-fns';

import { notification } from 'antd';

import { DayTasks } from '../models/dayTasks.ts';
import { OnTaskDescriptionEdit } from '../components/Calendar';
import { uploadFile } from '../utils/uploadFile.ts';
import { downloadJsonFile } from '../utils/downloadFile.ts';

const useCalendar = () => {
  const [tasks, setTasks] = useState<DayTasks[]>([]);
  const [calendarType, setCalendarType] = useState<'week' | 'month'>('month');
  const [searchTasksValue, setSearchTasksValue] = useState('');
  const [textLabelsFilter, setTextLabelsFilter] = useState<string[]>();
  const [colorLabelsFilter, setColorLabelsFilter] = useState<string[]>();
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [textLabels, setTextLabels] = useState<string[]>([]);
  const [colorLabels, setColorLabels] = useState<string[]>([]);

  const filteredTasks = tasks.map((task) => ({
    ...task,
    tasks: task.tasks.filter(
      (t) =>
        t.description
          .toLocaleLowerCase()
          .includes(searchTasksValue.toLocaleLowerCase()) &&
        (textLabelsFilter?.length
          ? textLabelsFilter.some((l) => t.textLabels.includes(l))
          : true) &&
        (colorLabelsFilter?.length
          ? colorLabelsFilter.some((l) => t.colorLabels.includes(l))
          : true)
    ),
  }));

  const nextCalendarDate = () => {
    setCalendarDate((prev) =>
      calendarType === 'week'
        ? addWeeks(prev, 1)
        : calendarType === 'month'
          ? addMonths(prev, 1)
          : prev
    );
  };

  const previousCalendarDate = () => {
    setCalendarDate((prev) =>
      calendarType === 'week'
        ? subWeeks(prev, 1)
        : calendarType === 'month'
          ? subMonths(prev, 1)
          : prev
    );
  };

  const handleTaskDescriptionEdit: OnTaskDescriptionEdit = ({
    id,
    date,
    description,
  }) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.date.toDateString() === date.toDateString()) {
          const editableTask = task.tasks.find((t) => t.id === id);
          if (editableTask) {
            editableTask.description = description;
          }
        }

        return task;
      })
    );
  };

  const importCalendar = async () => {
    try {
      const data = await uploadFile('application/JSON');
      if ('tasks' in data && 'textLabels' in data && 'colorLabels' in data) {
        setTasks(
          data.tasks.map((task: any) => ({
            ...task,
            date: new Date(task.date),
          }))
        );
        setColorLabels(data.colorLabels);
        setTextLabels(data.textLabels);
      } else {
        throw new Error('Invalid file format');
      }
    } catch (error) {
      notification.error({
        message: "Couldn't import file",
      });
    }
  };

  const exportCalendar = () => {
    downloadJsonFile({
      content: JSON.stringify({
        tasks,
        colorLabels,
        textLabels,
      }),
      name: 'calendar',
    });
  };

  return {
    calendarDate,
    calendarType,
    textLabels,
    colorLabels,
    textLabelsFilter,
    colorLabelsFilter,
    tasks,
    filteredTasks,
    setTasks,
    nextCalendarDate,
    previousCalendarDate,
    handleTaskDescriptionEdit,
    importCalendar,
    exportCalendar,
    setCalendarType,
    setTextLabels,
    setColorLabels,
    setSearchTasksValue,
    setTextLabelsFilter,
    setColorLabelsFilter,
  };
};

export default useCalendar;
