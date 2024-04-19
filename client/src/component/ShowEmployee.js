import React, { useEffect, useState, useCallback } from "react";
import http from "../services/httpService";
import { Space, Button, Alert } from "antd";
import EmployeeColumns from "./EmployeeColumns";
import { Link, useNavigate } from "react-router-dom";
import EmployeeTable from "./EmployeeTable";
import EmployeeSearch from "./EmployeeSearch";

function ShowEmployee() {
  const [employees, setEmployees] = useState([]);
  const [info, setInfo] = useState(null);
  const [search, setSearch] = useState(null);
  const navigate = useNavigate();

  const fetchEmployees = useCallback(async () => {
    let url = search ? `/employee/empanddep${search}` : '/employee/empanddep';
    try {
      let response = await http.get(url);
      setEmployees(response.data);
    } catch (err) {
      console.log(err);
    }
  }, [search]);

  useEffect(() => {
    fetchEmployees();
  }, [employees]);

  const handleDelete = useCallback(async (record) => {
    try {
      let response = await http.deleteApi(`/employee/${record.id}`);
      setInfo(response.data);
    } catch (err) {
      console.log(err);
    }
  }, []);

  const handleEdit = useCallback(
    (recordId) => {
      console.log("hello", recordId);
      try {
        navigate(`/edit/${recordId}`);
      } catch (err) {
        console.log(err);
      }
    },
    [navigate]
  );

  const handleSearch = (e) => {
    const { currentTarget: input } = e;
    let str = `?search=${input.value}`;
    setSearch(str);
  };

  return (
    <div className="mt-4 ">
      <div className="px-5">
        <Button type="primary" className="mb-3">
          <Link to="/add" className="text-decoration-none">
            Add Employee
          </Link>
        </Button>
        <EmployeeSearch handleSearch={handleSearch} />
        {info?.message && (
          <Alert
            message={info?.message}
            type="success"
            className="mb-3 mt-3"
            closable
          />
        )}
      </div>
      <div className="p-5">
        <EmployeeTable
          employees={employees}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
        />
      </div>
    </div>
  );
}

export default ShowEmployee;
