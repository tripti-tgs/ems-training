import React from "react";
import { Input } from "antd";

const EmployeeSearch = ({ handleSearch }) => {
  return <Input placeholder="search..." onChange={handleSearch} />;
};

export default EmployeeSearch;
