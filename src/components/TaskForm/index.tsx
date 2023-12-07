import { MouseEvent, ChangeEvent, FC, useRef, useState } from 'react';

import {
  Button,
  ColorPicker,
  Divider,
  Form,
  FormInstance,
  Input,
  InputRef,
  Select,
  Space,
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';

import { useOutsideClick } from '../../hooks';

export interface TaskFormFinishValues {
  description: string;
  date: Date;
  textLabels?: string[];
  colorLabels?: string[];
}

interface TaskFormProps {
  form: FormInstance;
  textLabels: string[];
  addTextLabel: (label: string) => void;
  colorLabels: string[];
  addColorLabel: (label: string) => void;
  onFinish: (values: TaskFormFinishValues) => void;
}

const TaskForm: FC<TaskFormProps> = ({
  form,
  textLabels,
  addTextLabel,
  colorLabels,
  addColorLabel,
  onFinish,
}) => {
  const [textLabel, setTextLabel] = useState('');
  const textLabelInputRef = useRef<InputRef>(null);
  const colorMenuRef = useRef<HTMLDivElement>(null);
  const colorPickerRef = useRef<HTMLDivElement>(null);
  const [colorLabel, setColorLabel] = useState('');
  const [colorMenuOpen, setColorMenuOpen] = useState(false);

  const onTextLabelChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTextLabel(event.target.value);
  };

  const handleAddTextLabelClick = (
    e: MouseEvent<HTMLButtonElement | HTMLAnchorElement>
  ) => {
    e.preventDefault();

    if (!textLabel) {
      return;
    }

    if (textLabels.includes(textLabel)) {
      return;
    }

    addTextLabel(textLabel);
    setTextLabel('');
    setTimeout(() => {
      textLabelInputRef.current?.focus();
    }, 0);
  };

  const handleAddColorLabelClick = (
    e: MouseEvent<HTMLButtonElement | HTMLAnchorElement>
  ) => {
    e.preventDefault();

    if (!colorLabel) {
      return;
    }

    if (colorLabels.includes(colorLabel)) {
      return;
    }

    addColorLabel(colorLabel);
  };

  useOutsideClick([colorMenuRef, colorPickerRef], () =>
    setColorMenuOpen(false)
  );

  return (
    <Form form={form} onFinish={onFinish}>
      <Form.Item hidden name="date">
        <Input />
      </Form.Item>
      <Form.Item
        name="description"
        label="Description"
        rules={[{ required: true }]}
      >
        <Input />
      </Form.Item>
      <Form.Item name="textLabels" label="Text labels">
        <Select
          style={{ width: 300 }}
          mode="multiple"
          placeholder="custom dropdown render"
          dropdownRender={(menu) => (
            <>
              {menu}
              <Divider style={{ margin: '8px 0' }} />
              <Space style={{ padding: '0 8px 4px' }}>
                <Input
                  placeholder="Please enter item"
                  ref={textLabelInputRef}
                  value={textLabel}
                  onChange={onTextLabelChange}
                  onKeyDown={(e) => e.stopPropagation()}
                />
                <Button
                  type="text"
                  icon={<PlusOutlined />}
                  onClick={handleAddTextLabelClick}
                >
                  Add item
                </Button>
              </Space>
            </>
          )}
          options={textLabels.map((item) => ({ label: item, value: item }))}
        />
      </Form.Item>
      <Form.Item name="colorLabels" label="Color labels">
        <Select
          style={{ width: 300 }}
          mode="multiple"
          open={colorMenuOpen}
          placeholder="custom dropdown render"
          onClick={() => setColorMenuOpen(true)}
          optionRender={({ value }) => (
            <div
              style={{
                background: `#${value}`,
                borderRadius: 4,
                paddingLeft: 5,
              }}
            >
              {value}
            </div>
          )}
          dropdownRender={(menu) => (
            <div ref={colorMenuRef}>
              {menu}
              <Divider style={{ margin: '8px 0' }} />
              <Space style={{ padding: '0 8px 4px' }}>
                <ColorPicker
                  value={'#' + colorLabel}
                  panelRender={(panel) => (
                    <div ref={colorPickerRef}>{panel}</div>
                  )}
                  onChangeComplete={(color) => setColorLabel(color.toHex())}
                />
                <Button
                  type="text"
                  icon={<PlusOutlined />}
                  onClick={handleAddColorLabelClick}
                >
                  Add item
                </Button>
              </Space>
            </div>
          )}
          options={colorLabels.map((item) => ({ label: item, value: item }))}
        />
      </Form.Item>
    </Form>
  );
};

export default TaskForm;
