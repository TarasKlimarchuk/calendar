import { FC, useRef, useState } from 'react';
import domtoimage from 'dom-to-image';
import uuid4 from 'uuid4';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';

import { Button, Modal, notification, Space } from 'antd';
import ButtonGroup from 'antd/es/button/button-group';
import { useForm } from 'antd/es/form/Form';
import { ArrowLeftOutlined, ArrowRightOutlined } from '@ant-design/icons';
import styled from 'styled-components';

import TaskForm, { TaskFormFinishValues } from '../TaskForm';
import { downloadFile } from '../../utils/downloadFile.ts';
import WeekCalendarDays from '../WeekCalendarDays';
import MonthCalendarDays from '../MonthCalendarDays';
import useCalendar from '../../hooks/useCalendar.ts';
import CalendarFilters from '../CalendarFilters';

export type OnTaskDescriptionEdit = (task: {
  id: string;
  description: string;
  date: Date;
}) => void;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
`;

const CalendarHeader = styled.div`
  padding: 20px;
`;

const HeaderActions = styled.div`
  width: 100%;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const DateScroller = styled.div`
  width: 20%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;

  & h2 {
    margin: auto;
  }
`;

const CalendarGrid = styled.div`
  background: #ffffff;
  width: 100%;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
`;

const GridHeader = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-around;

  & > div {
    width: 100px;
    text-align: center;
  }
`;

const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];
const Calendar: FC = () => {
  const {
    tasks,
    setTasks,
    calendarType,
    filteredTasks,
    textLabelsFilter,
    colorLabelsFilter,
    textLabels,
    colorLabels,
    calendarDate,
    previousCalendarDate,
    nextCalendarDate,
    handleTaskDescriptionEdit,
    importCalendar,
    exportCalendar,
    setCalendarType,
    setTextLabels,
    setColorLabels,
    setSearchTasksValue,
    setTextLabelsFilter,
    setColorLabelsFilter,
  } = useCalendar();

  const [addTaskModalIsOpen, setAddTaskModalOpen] = useState(false);
  const [draggingDay, setDraggingDay] = useState<string>();

  const [addTaskForm] = useForm();
  const calendarRef = useRef<HTMLDivElement>(null);

  const handleCellClick = (date: Date) => {
    addTaskForm.setFieldsValue({ date });
    setAddTaskModalOpen(true);
  };

  const rearangeArr = <A,>(
    arr: A[],
    sourceIndex: number,
    destIndex: number
  ): A[] => {
    const arrCopy = [...arr];
    const [removed] = arrCopy.splice(sourceIndex, 1);
    arrCopy.splice(destIndex, 0, removed);

    return arrCopy;
  };

  const onDragEnd = ({ source, destination }: DropResult) => {
    setDraggingDay(undefined);

    if (!destination) {
      return;
    }

    if (destination.droppableId !== source.droppableId) {
      const sourceItem = tasks.find(
        (task) => task.date.toDateString() === source.droppableId
      )?.tasks[source.index];

      if (!sourceItem) {
        return;
      }

      if (
        tasks.some(
          (task) => task.date.toDateString() === destination.droppableId
        )
      ) {
        setTasks(
          tasks.map((task) => {
            if (task.date.toDateString() === source.droppableId) {
              task.tasks.splice(source.index, 1);
            }

            if (task.date.toDateString() === destination.droppableId) {
              task.tasks.splice(destination.index, 0, sourceItem);
            }

            return task;
          })
        );
      } else {
        setTasks([
          ...tasks.map((task) => {
            if (task.date.toDateString() === source.droppableId) {
              task.tasks.splice(source.index, 1);
            }

            return task;
          }),
          { date: new Date(destination.droppableId), tasks: [sourceItem] },
        ]);
      }
    } else {
      setTasks(
        tasks.map((task) => {
          if (task.date.toDateString() === destination.droppableId) {
            task.tasks = rearangeArr(
              tasks.find(
                (task) => task.date.toDateString() === destination.droppableId
              )?.tasks ?? [],
              source.index,
              destination.index
            );
          }

          return task;
        })
      );
    }
  };

  const handleFinish = ({
    description,
    date,
    textLabels,
    colorLabels,
  }: TaskFormFinishValues) => {
    setTasks((prevDayTasks) => {
      const dayTask = prevDayTasks.find(
        (day) => day.date.toDateString() === date.toDateString()
      );
      if (dayTask) {
        dayTask.tasks.push({
          id: uuid4(),
          description,
          colorLabels: colorLabels || [],
          textLabels: textLabels || [],
        });
        return [...prevDayTasks];
      } else {
        return [
          ...prevDayTasks,
          {
            date,
            tasks: [
              {
                id: uuid4(),
                description,
                colorLabels: colorLabels || [],
                textLabels: textLabels || [],
              },
            ],
          },
        ];
      }
    });
    setAddTaskModalOpen(false);
    addTaskForm.resetFields();
  };

  const downloadImage = async () => {
    if (calendarRef.current) {
      try {
        const base64Image = await domtoimage.toPng(calendarRef.current);
        const base64WithoutPrefix = base64Image.split(',')[1];

        const binaryArray = atob(base64WithoutPrefix)
          .split('')
          .map((char) => char.charCodeAt(0));
        downloadFile({
          content: new Uint8Array(binaryArray),
          name: 'calendar.png',
          type: 'image/png',
        });
      } catch (e) {
        notification.error({
          message: "Couldn't download image",
        });
      }
    }
  };

  return (
    <Wrapper>
      <CalendarHeader>
        <HeaderActions>
          <DateScroller>
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={previousCalendarDate}
            />
            <h2>
              {months[calendarDate.getMonth()]} {calendarDate.getFullYear()}
            </h2>
            <Button icon={<ArrowRightOutlined />} onClick={nextCalendarDate} />
          </DateScroller>
          <Space>
            <Button onClick={downloadImage}>image</Button>
            <Button onClick={importCalendar}>import</Button>
            <Button onClick={exportCalendar}>export</Button>
            <ButtonGroup>
              <Button
                disabled={calendarType === 'week'}
                type="primary"
                onClick={() => setCalendarType('week')}
              >
                Week
              </Button>
              <Button
                disabled={calendarType === 'month'}
                type="primary"
                onClick={() => setCalendarType('month')}
              >
                Month
              </Button>
            </ButtonGroup>
          </Space>
        </HeaderActions>
        <CalendarFilters
          onTextSearch={setSearchTasksValue}
          textLabels={textLabels}
          colorLabels={colorLabels}
          textLabelsFilter={textLabelsFilter}
          colorLabelsFilter={colorLabelsFilter}
          setTextLabelsFilter={setTextLabelsFilter}
          setColorLabelsFilter={setColorLabelsFilter}
        />
      </CalendarHeader>
      <CalendarGrid ref={calendarRef}>
        <GridHeader>
          {weekdays.map((weekday) => (
            <div key={weekday} className="weekday">
              <p>{weekday}</p>
            </div>
          ))}
        </GridHeader>
        <DragDropContext
          onDragEnd={onDragEnd}
          onDragStart={({ source }) => setDraggingDay(source.droppableId)}
        >
          {calendarType === 'month' && (
            <MonthCalendarDays
              draggingDay={draggingDay}
              tasks={filteredTasks}
              date={calendarDate}
              onTaskAdd={handleCellClick}
              onTaskDescriptionEdit={handleTaskDescriptionEdit}
            />
          )}
          {calendarType === 'week' && (
            <WeekCalendarDays
              draggingDay={draggingDay}
              tasks={filteredTasks}
              date={calendarDate}
              onTaskAdd={handleCellClick}
              onTaskDescriptionEdit={handleTaskDescriptionEdit}
            />
          )}
        </DragDropContext>
      </CalendarGrid>
      <Modal
        title="Add task"
        open={addTaskModalIsOpen}
        onOk={addTaskForm.submit}
        onCancel={() => setAddTaskModalOpen(false)}
      >
        <TaskForm
          textLabels={textLabels}
          colorLabels={colorLabels}
          addTextLabel={(label) => setTextLabels((prev) => [...prev, label])}
          addColorLabel={(label) => setColorLabels((prev) => [...prev, label])}
          form={addTaskForm}
          onFinish={handleFinish}
        />
      </Modal>
    </Wrapper>
  );
};

export default Calendar;
