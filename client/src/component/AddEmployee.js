import React, { useEffect, useState, Fragment } from "react";
import http from "../services/httpService";
import {
  Button,
  Cascader,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Mentions,
  Select,
  TreeSelect,
  Alert,
} from "antd";
const { Option } = Select;
const formItemLayout = {
  labelCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 6,
    },
  },
  wrapperCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 14,
    },
  },
};

const onFinishFailed = (errorInfo) => {
  console.log("Failed:", errorInfo);
};
function AddEmployee() {
  const [dept, setDept] = useState([]);
  const [employees, setEmployees] = useState();
  const [info, setInfo] = useState(null);

  const onFinish = async (values) => {
    let date = `${values.dob.$y}-${values.dob.$M <9 ? `0${values.dob.$M + 1}`:`${values.dob.$M + 1}`}-${values.dob.$D}`;
    values.dob = date;
    // console.log("Success:", values);
    try {
      let response = await http.post("/employee/create", values);
      setEmployees(response.data);
      setInfo(null)
    } catch (err) {
      console.log("errr", err);
      setInfo(err?.response?.data?.message);
    }
  };

  useEffect(() => {
    const fetchDepartment = async () => {
      try {
        let response = await http.get("/department");
        setDept(response.data);
        setInfo(null)
      } catch (err) {
        console.log(err);
      }
    };

    fetchDepartment();
  }, [dept]);

  return (
    <Fragment>
      {info && (
        <Alert message={info} type="success" className="mb-3" closable />
      )}

      <Form
        {...formItemLayout}
        variant="filled"
        style={{
          maxWidth: 600,
        }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Form.Item
          label="Name"
          name="name"
          rules={[
            {
              required: true,
              message: "Please name!",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            {
              required: true,
              message: "Please Email",
            },
            {
              type: "email",
              message: "Please enter a valid email",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Phone"
          name="phone"
          rules={[
            {
              required: true,
              message: "Please input your phone number",
            },
          ]}
        >
          <InputNumber style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          label="Department"
          name="dept_id"
          rules={[
            {
              required: true,
              message: "Please Department",
            },
          ]}
        >
          <Select placeholder="select your department">
            {dept.map((d) => (
              <Option value={d.id}>{d.name}</Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Gender"
          name="gender"
          rules={[
            {
              required: true,
              message: "Please select gender",
            },
          ]}
        >
          <Select placeholder="select your gender">
            <Option value="1">Male</Option>
            <Option value="0">Female</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Birth of date"
          name="dob"
          rules={[
            {
              required: true,
              message: "Please Birth of Date",
            },
          ]}
        >
          <DatePicker />
        </Form.Item>

        <Form.Item
          wrapperCol={{
            offset: 6,
            span: 16,
          }}
        >
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Fragment>
  );
}

export default AddEmployee;
