import React, { useEffect, useState, useCallback } from 'react';
import http from '../services/httpService';
import { Button, Alert } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import EmployeeTable from './EmployeeTable';
import EmployeeSearch from './EmployeeSearch';

const ShowEmployee = () => {
  const [employees, setEmployees] = useState([]);
  const [info, setInfo] = useState(null);
  const [search, setSearch] = useState(null);
  const navigate = useNavigate();

  const fetchEmployees = useCallback(async () => {
    const url = search ? `/employee/empanddep${search}` : '/employee/empanddep';
    try {
      const response = await http.get(url);
      setEmployees(response);
    } catch (err) {
      console.error(err);
    }
  }, [search,employees]);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const handleDelete = useCallback(async (record) => {
    try {
      const response = await http.deleteApi(`/employee/${record.id}`);
      setInfo(response?.message);
    } catch (err) {
      console.error(err);
    }
  }, []);

  const handleEdit = useCallback(
    (recordId) => {
      try {
        navigate(`/edit/${recordId}`);
      } catch (err) {
        console.error(err);
      }
    },
    [navigate]
  );

  const handleSearch = (e) => {
    const { currentTarget: input } = e;
    const str = `?search=${input.value}`;
    setSearch(str);
  };

  return (
    <div className="mt-4">
      <div className="px-5">
        <Button type="primary" className="mb-3">
          <Link to="/add" className="text-decoration-none">
            Add Employee
          </Link>
        </Button>
        <EmployeeSearch handleSearch={handleSearch} />
        {info?.message && (
          <Alert
            message={info.message}
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
};

export default ShowEmployee;
