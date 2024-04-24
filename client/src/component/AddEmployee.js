import React, { useEffect, useState, Fragment, useCallback } from 'react';
import http from '../services/httpService';
import { useParams, useNavigate } from 'react-router-dom';
import moment from 'moment';
import { Button, DatePicker, Form, Input, InputNumber, Select, Alert } from 'antd';
import dayjs from 'dayjs';

const { Option } = Select;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 14 },
  },
};

const AddEmployee = () => {
  const [dept, setDept] = useState([]);
  const [info, setInfo] = useState(null);
  const [form] = Form.useForm();
  const { id } = useParams();
  const navigate = useNavigate();

  const fetchDepartment = useCallback(async () => {
    try {
      const response = await http.get('/department');
      setDept(response);
      setInfo(null);
    } catch (err) {
      console.error(err);
    }
  }, []);

  const fetchEmployee = useCallback(async () => {
    if (id) {
      try {
        const response = await http.get(`/employee/${id}`);
        const { name, email, phone, dept_id, gender, dob } = response;

        const formattedDob = dayjs(dob).format('YYYY-MM-DD');

        form.setFieldsValue({
          name,
          email,
          phone,
          dept_id,
          gender: gender.toString(),
          dob: dayjs(formattedDob),
        });
      } catch (err) {
        console.error(err);
      }
    }
  }, [id, form]);

  useEffect(() => {
    fetchDepartment();
    fetchEmployee();
  }, [fetchDepartment, fetchEmployee]);

  const onFinish = useCallback(
    async (values) => {
      const date = moment(values?.dob?.$d).format('YYYY-MM-DD');
      
      values.dob = date;
      try {
        const response = id
          ? await http.put(`/employee/${id}`, values)
          : await http.post('/employee/create', values);
        navigate('/');
      } catch (err) {
        setInfo(err?.response?.data?.message);
      }
    },
    [id, navigate]
  );

  const onFinishFailed = (errorInfo) => {
    console.error('Failed:', errorInfo);
  };

  return (
    <Fragment>
      <div className="my-4 text-center">
        <h1>{id ? 'Edit Employee' : 'Add Employee'}</h1>
      </div>
      <div className="">
        {info && <Alert message={info} type="success" className="mb-3" closable />}
        <Form
          form={form}
          {...formItemLayout}
          variant="filled"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: 'Please Enter Your Name' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Please Enter Your Email' },
              { type: 'email', message: 'Please enter a valid email' },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Phone"
            name="phone"
            rules={[
              { required: true, message: 'Please Enter Your Phone Number' },
              { pattern: /^[0-9]{10}$/, message: 'Please input a 10-digit phone number' },
            ]}
          >
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            label="Department"
            name="dept_id"
            rules={[{ required: true, message: 'Please Select Your Department' }]}
          >
            <Select placeholder="select your department">
              {dept.map((d) => (
                <Option value={d.id} key={d.id}>
                  {d.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Gender"
            name="gender"
            rules={[{ required: true, message: 'Please Select Your Gender' }]}
          >
            <Select placeholder="select your gender">
              <Option value="1">Male</Option>
              <Option value="0">Female</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Birth of date"
            name="dob"
            rules={[{ required: true, message: 'Please Enter Your Birth of Date' }]}
          >
            <DatePicker format="YYYY-MM-DD" maxDate={dayjs('2020-10-31')} />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </div>
    </Fragment>
  );
};

export default AddEmployee;
