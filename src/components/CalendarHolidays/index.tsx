import { FC } from 'react';

import { Button, Tooltip } from 'antd';
import styled from 'styled-components';

import { Holiday } from '../../models/holiday.ts';

const Wrapper = styled.div`
  margin-top: 10px;
  border-radius: 10px;
  background: #f4ffb8;
  padding: 10px;
`;

interface CalendarHolidaysProps {
  holidays: Holiday[];
}

const CalendarHolidays: FC<CalendarHolidaysProps> = ({ holidays }) => {
  if (holidays.length === 0) {
    return;
  }

  return (
    <Wrapper>
      {holidays.length < 3 ? (
        holidays.map((holiday) => <div key={holiday.name}>{holiday.name}</div>)
      ) : (
        <Tooltip
          title={() =>
            holidays.map((holiday) => (
              <div key={holiday.name}>{holiday.name}</div>
            ))
          }
        >
          <Button style={{ cursor: 'default', width: '100%' }} type="dashed">
            holidays: {holidays.length}
          </Button>
        </Tooltip>
      )}
    </Wrapper>
  );
};

export default CalendarHolidays;
