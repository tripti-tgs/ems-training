import React from "react";
import { Button, Popconfirm } from "antd";

const EmployeeColumns = (handleEdit, handleDelete) => {
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Image",
      dataIndex: "emp_img",
      key: "emp_img",
      render: (text, record) =>
        record?.emp_img !== "" ? (
          <img
            src={`${record?.emp_img}?token=Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEzLCJ1c2VybmFtZSI6Im5pa2VUcmkwMSIsImVtYWlsIjoidHJpcHRpMTIzNDY3ODk4QGdtYWlsLmNvbSIsImlhdCI6MTcxNTA4MDMxM30.cXQgCBjYSlceLFcFPs_VEVhCcJ7-ou_c4TMnZ4F36lY `}
            alt={record.name}
            style={{ maxWidth: "100px" }}
          />
        ) : (
          <p>No Found!</p>
        ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Department",
      dataIndex: ["department", "name"],
      key: "department",
    },
    {
      title: "Gender",
      dataIndex: "gender",
      key: "gender",
      render: (text) => (text === 1 ? "Male" : "Female"),
    },
    {
      title: "Date of Birth",
      dataIndex: "dob",
      key: "dob",
    },
    {
      title: "Created At",
      dataIndex: "created_at",
      key: "created_at",
      render: (text) => (text ? new Date(text).toLocaleString() : ""),
    },
    {
      title: "Updated At",
      dataIndex: "updated_at",
      key: "updated_at",
      render: (text) => (text ? new Date(text).toLocaleString() : ""),
    },
    {
      title: "Deleted At",
      dataIndex: "deleted_at",
      key: "deleted_at",
      render: (text) => (text ? new Date(text).toLocaleString() : ""),
    },
    {
      title: "Created By",
      dataIndex: "created_by",
      key: "created_by",
    },
    {
      title: "Updated By",
      dataIndex: "updated_by",
      key: "updated_by",
    },
    {
      title: "Deleted By",
      dataIndex: "deleted_by",
      key: "deleted_by",
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <>
          <Button
            type="primary"
            size="small"
            onClick={() => handleEdit(record.id)}
          >
            Edit
          </Button>
          {record.isDeleted !== 1 && (
            <Popconfirm
              title="Are you sure you want to delete this employee?"
              onConfirm={() => handleDelete(record)}
              okText="Yes"
              cancelText="No"
            >
              <Button danger size="small" style={{ marginTop: "8px" }}>
                Delete
              </Button>
            </Popconfirm>
          )}
        </>
      ),
    },
  ];

  return columns;
};

export default EmployeeColumns;
