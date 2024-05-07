import React, { useEffect, useState, Fragment, useCallback } from "react";
import http from "../services/httpService";
import { useParams, useNavigate } from "react-router-dom";
import moment from "moment";
import { UploadOutlined } from "@ant-design/icons";

import CryptoJS from "crypto-js";

import {
  Button,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Select,
  Alert,
  Upload,
  Image,
} from "antd";
import dayjs from "dayjs";

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
  const [images, setImages] = useState(null);
  let token =
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEzLCJ1c2VybmFtZSI6Im5pa2VUcmkwMSIsImVtYWlsIjoidHJpcHRpMTIzNDY3ODk4QGdtYWlsLmNvbSIsImlhdCI6MTcxNTA4MDMxM30.cXQgCBjYSlceLFcFPs_VEVhCcJ7-ou_c4TMnZ4F36lY";

  const fetchDepartment = useCallback(async () => {
    try {
      const response = await http.get("/department");
      console.log(response);
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
        const { name, email, phone, dept_id, gender, dob, emp_img } = response;

        const formattedDob = dayjs(dob).format("YYYY-MM-DD");
      

        let url = `${emp_img}?token=${token}`;
        const imageResponse = await fetch(url);
        console.log(imageResponse.url)
        const blob = await imageResponse.blob();
        console.log(blob)
        const imageUrl = URL.createObjectURL(blob);
        setImages(imageUrl);
       

        form.setFieldsValue({
          name,
          email,
          phone,
          dept_id,
          emp_img,
          gender: gender.toString(),
          dob: dayjs(formattedDob),
        });
      } catch (err) {
        console.error(err);
      }
    }
  }, [id, form,token]);

  useEffect(() => {
    fetchDepartment();
    fetchEmployee();
  }, []);

  const onFinish = useCallback(
    async (values) => {
      let formDataToSend = new FormData();
      console.log(values.emp_img);

      let file;
      if (values?.emp_img?.file?.originFileObj) {
        file = values?.emp_img?.file?.originFileObj;
      } else {
        const parts = values.emp_img.split("/");
        const imageName = parts[parts.length - 1];
        const response = await fetch(values.emp_img);
        const blob = await response.blob();
        file = new File([blob], imageName, { type: "image/jpeg" });
      }

      for (let key in values) {
        if (key === "dob") {
          formDataToSend.set(key, moment(values[key].$d).format("YYYY-MM-DD"));
        } else if (key === "emp_img") {
          formDataToSend.append(key, file);
        } else {
          formDataToSend.append(key, values[key]);
        }
      }
      try {
        const response = id
          ? await http.put(`/employee/${id}`, formDataToSend)
          : await http.post("/employee/create", formDataToSend);
        navigate("/");
      } catch (err) {
        setInfo(err?.response?.data?.message);
      }
    },
    [id]
  );

  const onFinishFailed = (errorInfo) => {
    console.error("Failed:", errorInfo);
  };

  return (
    <Fragment>
      <div className="my-4 text-center">
        <h1>{id ? "Edit Employee" : "Add Employee"}</h1>
      </div>
      <div className=" me-5 pe-5">
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
          {/* <img src={images} /> */}
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Please Enter Your Name" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please Enter Your Email" },
              { type: "email", message: "Please enter a valid email" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Phone"
            name="phone"
            rules={[
              { required: true, message: "Please Enter Your Phone Number" },
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
              { required: true, message: "Please Select Your Department" },
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
            rules={[{ required: true, message: "Please Select Your Gender" }]}
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
              { required: true, message: "Please Enter Your Birth of Date" },
            ]}
          >
            <DatePicker format="YYYY-MM-DD" maxDate={dayjs("2020-10-31")} />
          </Form.Item>

          <Form.Item
            label="Profile Image"
            name="emp_img"
            rules={[{ required: true, message: "Please choose the image" }]}
          >
            <Upload
              maxCount={1}
              onChange={(info) => {
                if (info.fileList.length === 0) {
                  setImages(null);
                } else {
                  setImages(
                    info.fileList[0].thumbUrl || info.fileList[0].originFileObj
                  );
                  form.setFieldsValue({ emp_img: info });
                }
              }}
            >
              <Button icon={<UploadOutlined />}>Click to Upload</Button>
            </Upload>
            <div style={{ marginTop: "10px" }}>
              {images ? (
                <Image
                  width={150}
                  src={
                    typeof images === "string" ? `${images}` : images.thumbUrl
                  }
                />
              ) : (
                <p>No image found!</p>
              )}
            </div>
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
