import React from 'react';
import { Table } from 'antd';
import EmployeeColumns from './EmployeeColumns';

const EmployeeTable = ({ employees, handleEdit, handleDelete }) => {
  return (
    <Table
      columns={EmployeeColumns(handleEdit, handleDelete)}
      dataSource={employees}
      bordered
      centered
      size='small'
    />
  );
};

export default EmployeeTable;
