import React, { useEffect, useState, Fragment, useCallback } from "react";
import http from "../services/httpService";
import { useParams, useNavigate } from "react-router-dom";
import moment from "moment";
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
import dayjs from "dayjs";
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

function AddEmployee() {
  const [dept, setDept] = useState([]);
  const [employees, setEmployees] = useState();
  const [info, setInfo] = useState(null);
  const [form] = Form.useForm();
  let { id } = useParams();

  console.log(id);

  let navigate = useNavigate();

  const fetchDepartment = useCallback(async () => {
    try {
      let response = await http.get("/department");
      setDept(response.data);
      setInfo(null);
    } catch (err) {
      console.log(err);
    }
  }, []);

  useEffect(() => {
    if (id) {
      const fetchEmployee = async () => {
        try {
          let response = await http.get(`/employee/${id}`);

          let { name, email, phone, dept_id, gender, dob } = response.data;

          dob = new Date(response.data.dob);

          form.setFieldsValue({
            name,
            email,
            phone,
            dept_id: dept_id,
            gender: gender.toString(),
            dob: dayjs(dob),
          });
        } catch (err) {
          console.log(err);
        }
      };

      fetchEmployee();
    }
  }, [id, form]);

  useEffect(() => {
    fetchDepartment();
  }, [fetchDepartment]);

  const onFinish = useCallback(
    async (values) => {
      let date = `${values.dob.$y}-${
        values.dob.$M < 9 ? `0${values.dob.$M + 1}` : `${values.dob.$M + 1}`
      }-${
        values.dob.$D < 10 ? `0${values.dob.$D}` : `${values.dob.$D}`
      }`;
      
      values.dob = date;
      // console.log(values);
      try {
        if (id) {
          let response = await http.put(`/employee/${id}`, values);
          // setInfo(response.data);
          alert("Employee details updated successfully");
          navigate(`/`);
        } else {
          let response = await http.post("/employee/create", values);
          // setInfo(response.data);
          alert("Employee details add successfully");
          navigate(`/`);
        }
      } catch (err) {
        console.log("errr", err);
        setInfo(err?.response?.data?.message);
      }
    },
    [id]
  );

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  console.log(form);
  return (
    <Fragment>
      <div className="my-4 text-center">
        <h1>{id ? "Edit Employee" : "Add Employee"}</h1>
      </div>
      <div className="">
        {info && (
          <Alert message={info} type="success" className="mb-3" closable />
        )}
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
              {
                pattern: /^[0-9]{10}$/,
                message: "Please input a 10-digit phone number",
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
                <Option value={d.id} key={d.id}>
                  {d.name}
                </Option>
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
            <DatePicker format="YYYY-MM-DD" maxDate={dayjs("2020-10-31")} />
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
      </div>
    </Fragment>
  );
}

export default AddEmployee;
