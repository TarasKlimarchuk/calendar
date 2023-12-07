import { FC, useState } from 'react';

import { Input, Space, Tag } from 'antd';
import styled from 'styled-components';

import { DayTasks } from '../../models/dayTasks.ts';

const Wrapper = styled.div`
  margin-top: 4px;
  background: #b5f5ec;
  border-radius: 5px;
  padding: 3px;
  cursor: pointer;
`;

interface CalendarTaskProps {
  task: DayTasks['tasks'][0];
  onDescriptionEdit: (description: string) => void;
}

const CalendarTask: FC<CalendarTaskProps> = ({ task, onDescriptionEdit }) => {
  const [edit, setEdit] = useState(false);
  const [editableDescription, setEditableDescription] = useState<string>('');

  const handleDoubleClick = () => {
    setEdit(true);
    setEditableDescription(task.description);
  };

  const handleBlur = () => {
    setEdit(false);
    onDescriptionEdit(editableDescription);
  };

  return (
    <Wrapper>
      <Space size={[0, 8]} wrap>
        {task.colorLabels.map((label) => (
          <Tag key={label} color={`#${label}`}>
            &nbsp;
          </Tag>
        ))}
        {task.textLabels.map((label) => (
          <Tag key={label}>{label}</Tag>
        ))}
      </Space>
      {edit ? (
        <Input
          autoFocus
          value={editableDescription}
          onChange={(e) => setEditableDescription(e.target.value)}
          onBlur={handleBlur}
        />
      ) : (
        <span onDoubleClick={handleDoubleClick}>{task.description}</span>
      )}
    </Wrapper>
  );
};

export default CalendarTask;
