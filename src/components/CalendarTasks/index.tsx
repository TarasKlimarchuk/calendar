import { FC, useEffect, useState } from 'react';
import { Draggable, Droppable } from 'react-beautiful-dnd';

import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import styled from 'styled-components';

import CalendarTask from '../CalendarTask';
import { OnTaskDescriptionEdit } from '../Calendar';
import { DayTasks } from '../../models/dayTasks.ts';

const Wrapper = styled.div`
  margin-top: 10px;
  position: relative;
`;

const Container = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  padding: 5px;
  border-radius: 10px;
  z-index: 1;
  background: #e6fffb;
`;

interface CalendarTasksProps {
  isDragging: boolean;
  date: Date;
  tasks: DayTasks['tasks'];
  onTaskDescriptionEdit: OnTaskDescriptionEdit;
  onTaskAdd: (date: Date) => void;
}

const CalendarTasks: FC<CalendarTasksProps> = ({
  isDragging,
  date,
  tasks,
  onTaskAdd,
  onTaskDescriptionEdit,
}) => {
  const [hover, setHover] = useState(false);

  useEffect(() => {
    setHover(isDragging);
  }, [isDragging]);

  const renderTasks = hover ? tasks : tasks[0] ? [tasks[0]] : [];

  return (
    <Wrapper>
      <Container
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => !isDragging && setHover(false)}
      >
        <Droppable key={date.toDateString()} droppableId={date.toDateString()}>
          {(provided) => (
            <div ref={provided.innerRef}>
              {renderTasks.map((task, index) => (
                <Draggable draggableId={task.id} key={task.id} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <CalendarTask
                        task={task}
                        onDescriptionEdit={(description) =>
                          onTaskDescriptionEdit({
                            id: task.id,
                            date,
                            description,
                          })
                        }
                      />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
        <Button
          style={{
            width: '100%',
            marginTop: tasks.length && 10,
          }}
          size="small"
          icon={<PlusOutlined />}
          onClick={() => onTaskAdd(date)}
        >
          Add task
        </Button>
      </Container>
    </Wrapper>
  );
};

export default CalendarTasks;
