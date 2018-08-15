import React from 'react';
import { Button, Form } from 'antd';
import styles from './index.less';
import classNames from 'classnames';
const FormItem = Form.Item;

const LoginSubmit = ({ className, ...rest }) => {
  const clsString = classNames(styles.submit, className);
  return (
    <FormItem>
      <Button size="large" className={clsString} type="primary" htmlType="submit" {...rest} />
    </FormItem>
  );
};

export default LoginSubmit;
