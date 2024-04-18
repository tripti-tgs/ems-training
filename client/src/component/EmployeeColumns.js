import { Space, Popconfirm, Button } from "antd";
import { Link } from "react-router-dom";
const EmployeeColumns = (handleDelete) => [
  {
    title: "Id",
    dataIndex: "id",
    rowScope: "id",
  },
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Date",
    dataIndex: "dob",
    key: "dob",
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
    title: "Gender",
    dataIndex: "gender",
    key: "gender",
    render: (gender) => (gender === 1 ? "Male" : "Female"),
  },
  {
    title: "Department",
    dataIndex: ["department", "name"],
    key: "department",
  },
  {
    title: "User Delete",
    dataIndex: "isDeleted",
    key: "isDeleted",
    render: (isDeleted) => (isDeleted === 1 ? "Yes" : "No"),
  },
  {
    title: "Created At",
    dataIndex: "created_at",
    key: "created_at",
  },
  {
    title: "Updated At",
    dataIndex: "updated_at",
    key: "updated_at",
  },
  {
    title: "Deleted At",
    dataIndex: "deleted_at",
    key: "deleted_at",
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
    title: "Action",
    key: "action",
    render: (_, record) => (
      <>
        <Link to={record.name}>Edit</Link>
        {record.isDeleted !== 1 && (
          <Popconfirm
            title="Are you sure you want to delete this employee?"
            onConfirm={() => handleDelete(record)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger style={{ marginLeft: "10px" }}>
              Delete
            </Button>
          </Popconfirm>
        )}
      </>
    ),
  },
];

export default EmployeeColumns;
