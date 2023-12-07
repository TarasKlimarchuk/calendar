import { FC } from 'react';

import { Input, Select, Space } from 'antd';
import styled from 'styled-components';

const { Search } = Input;

const ColorLabel = styled.div<{ label: string }>`
  background: #${({ label }) => label};
  border-radius: 4px;
  padding-left: 5px;
`;

interface CalendarFiltersProps {
  onTextSearch: (text: string) => void;
  textLabels: string[];
  colorLabels: string[];
  textLabelsFilter?: string[];
  colorLabelsFilter?: string[];
  setTextLabelsFilter: (labels: string[]) => void;
  setColorLabelsFilter: (labels: string[]) => void;
}

const CalendarFilters: FC<CalendarFiltersProps> = ({
  onTextSearch,
  textLabels,
  colorLabels,
  textLabelsFilter,
  colorLabelsFilter,
  setTextLabelsFilter,
  setColorLabelsFilter,
}) => {
  return (
    <Space>
      <Search
        placeholder="input search text"
        onSearch={onTextSearch}
        style={{ width: 300 }}
      />
      <Select
        placeholder="select text labels"
        style={{ width: 300 }}
        mode="multiple"
        options={textLabels.map((label) => ({ value: label, label }))}
        value={textLabelsFilter}
        onChange={setTextLabelsFilter}
      />
      <Select
        placeholder="select color labels"
        style={{ width: 300 }}
        mode="multiple"
        options={colorLabels.map((label) => ({
          value: label,
          label: <ColorLabel label={label}>{label}</ColorLabel>,
        }))}
        value={colorLabelsFilter}
        onChange={setColorLabelsFilter}
      />
    </Space>
  );
};

export default CalendarFilters;
