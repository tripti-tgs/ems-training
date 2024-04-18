import React, { useEffect, useState } from "react";
import http from "../services/httpService";
import { Space, Table, Flex, Tag, Alert, Button } from "antd";
import EmployeeColumns from "./EmployeeColumns";
import { Link } from "react-router-dom";

function ShowEmployee() {
  const [employees, setEmployees] = useState();
  const [info, setInfo] = useState();

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        let response = await http.get("/employee/empanddep");
        setEmployees(response.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchEmployees();
  }, [employees]);

  const handleDelete = async (record) => {
    console.log(record);
    try {
      let response = await http.deleteApi(`/employee/${record.id}`);
      console.clear();
      console.log(response.data);
      setInfo(response.data);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="mt-4 ">
      <div className="px-4">
        <Button type="primary" className="mb-3">
         <Link to='/add'>Add Employee</Link> 
        </Button>
        <Alert
          message={info?.message}
          type="success"
          className="mb-3"
          closable
        />
      </div>

      <Table
        columns={EmployeeColumns(handleDelete)}
        dataSource={employees}
        bordered
        centered
        size="small"
      />
    </div>
  );
}

export default ShowEmployee;
