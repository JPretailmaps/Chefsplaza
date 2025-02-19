/* eslint-disable no-template-curly-in-string */
import { validateMessages } from '@lib/message';
import {
  Button, Form, Select
} from 'antd';
import { COUNTRIES } from 'src/constants/countries';
import { IBlockCountries } from 'src/interfaces';

const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 }
};

interface IProps {
  onFinish: Function;
  blockCountries: IBlockCountries;
  updating: boolean;
}

const { Option } = Select;

export function PerformerBlockCountriesForm({
  blockCountries,
  updating,
  onFinish
}: IProps) {
  return (
    <Form
      {...layout}
      name="nest-messages"
      onFinish={onFinish.bind(this)}
      validateMessages={validateMessages}
      initialValues={blockCountries}
      labelAlign="left"
      className="account-form"
    >
      <Form.Item name="countryCodes" label="Select countries you want to block">
        <Select
          showSearch
          optionFilterProp="label"
          mode="multiple"
        >
          {COUNTRIES.map((c) => (
            <Option value={c.code} label={c.name} key={c.code}>
              <img alt="country_flag" src={c.flag} width="25px" />
              {' '}
              {c.name}
            </Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item className="text-center">
        <Button type="primary" htmlType="submit" className="primary" loading={updating}>
          Save Changes
        </Button>
      </Form.Item>
    </Form>
  );
}
