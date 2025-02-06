import { Checkbox, DatePicker, Form, Input, InputNumber, Radio, Select } from 'antd';
import { Rule } from 'antd/es/form';
import FloatLabel from './FloatLabel';
const { RangePicker } = DatePicker;

const CustomFormItem = ({
  label,
  name,
  rules,
  formType,
  propsFormItemType,
  propsFormChildType,
  classNameLable,
}: {
  label?: string;
  name: string;
  rules?: Rule[] | undefined;
  formType: string;
  propsFormItemType?: any;
  propsFormChildType?: any;
  classNameLable?: string;
}) => {
  const renderLayout = () => {
    switch (formType) {
      case 'input':
        return <Input type="text" {...propsFormChildType} />;
      case 'inputPassword':
        return <Input.Password {...propsFormChildType} />;
      case 'datepicker':
        return <DatePicker {...propsFormChildType} style={{ width: '100%' }} />;
      case 'rangepicker':
        return <RangePicker {...propsFormChildType} style={{ width: '100%' }} />;
      case 'select':
        return <Select type="text" {...propsFormChildType} />;
      case 'textarea':
        return <Input.TextArea {...propsFormChildType} />;
      case 'inputNumber':
        return <InputNumber {...propsFormChildType} style={{ width: '100%' }} />;
      case 'radio':
        return <Radio.Group {...propsFormChildType} />;
      case 'checkbox':
        return <Checkbox {...propsFormChildType} />;
      default:
        return <></>;
    }
  };
  return (
    <FloatLabel label={label} name={name} classNameLable={classNameLable}>
      <Form.Item
        name={name}
        rules={rules}
        wrapperCol={{ xs: 24 }}
        labelCol={{ xs: 24 }}
        labelAlign="left"
        {...propsFormItemType}
        className="form-item-custom"
      >
        {renderLayout()}
      </Form.Item>
    </FloatLabel>
  );
};

export default CustomFormItem;
