const { Op } = require("sequelize");
const {Employee} = require("../models/employee");
const sequelize = require("../db/index");
exports.getOneEmployees = async (req, res) => {
  const { id } = req.params;
  try {
    const employee = await Employee.getEmployeeById(id);
    if (Object.keys(employee).length === 0) {
      res.json({ message: "Employee is not present!" });
    }
    res.json(employee);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getAllEmployees = async (req, res) => {
  const { offset = 1, limit = 10 } = req.query;
  try {
    const employee = await Employee.getAllEmployees(offset, limit);
    if (Object.keys(employee).length === 0) {
      res.json({ message: "Employees is not present!" });
    }

    res.json(employee);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteEmployee = async (req, res) => {
  const { id } = req.params;
  try {
    const employee = await Employee.deleteEmployee(id);
    res.json("Employees delete successfully");
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.createEmployee = async (req, res) => {
  try {
    const employee = req.body;
    const result = await Employee.addOrUpdateEmployee(employee);
    res.json({ message: "Employee added or updated successfully!" });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
