import React, { useState } from "react";
import http from "../services/httpService";
import moment from "moment";

const AddEmployee = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    gender: "",
    dob: "",
    dept_id: "",
    emp_img: null,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormData({
      ...formData,
      emp_img: file,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const date = moment(formData.dob).format("YYYY-MM-DD");
    const data = new FormData();
    console.log(formData.emp_img)
    data.append("name", formData.name);
    data.append("email", formData.email);
    data.append("phone", formData.phone);
    data.append("gender", formData.gender);
    data.append("dob", date);
    data.append("dept_id", formData.dept_id);
    data.append("emp_img", formData.emp_img);

    try {
      await http.post("/employee/create", data);
    } catch (err) {
      console.error("Error adding employee:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="name"
        placeholder="Name"
        value={formData.name}
        onChange={handleInputChange}
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleInputChange}
      />
      <input
        type="text"
        name="phone"
        placeholder="Phone"
        value={formData.phone}
        onChange={handleInputChange}
      />
      <select
        name="gender"
        value={formData.gender}
        onChange={handleInputChange}
      >
        <option value="">Select Gender</option>
        <option value="1">Male</option>
        <option value="0">Female</option>
      </select>
      <input
        type="date"
        name="dob"
        placeholder="Date of Birth"
        value={formData.dob}
        onChange={handleInputChange}
      />
      <input
        type="text"
        name="dept_id"
        placeholder="Department ID"
        value={formData.dept_id}
        onChange={handleInputChange}
      />
      <input type="file" name="emp_img" onChange={handleImageChange} />
      <button type="submit">Add Employee</button>
    </form>
  );
};

export default AddEmployee;
