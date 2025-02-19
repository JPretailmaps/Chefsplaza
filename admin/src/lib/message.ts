import { message } from 'antd';
import { IError } from 'src/interfaces';

export const showError = async (e: IError) => {
  const err = await e;
  message.error(err?.message || 'Error occurred, please try again later');
};

export const validateMessages = {
  required: 'This field is required!',
  types: {
    email: 'Not a validate email!',
    number: 'Not a validate number!'
  },
  number: {
    // eslint-disable-next-line no-template-curly-in-string
    range: 'Must be between ${min} and ${max}'
  }
};
