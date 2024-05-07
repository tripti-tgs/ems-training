const { Op } = require("sequelize");
const Employee = require("../models/employee");
const Department = require("../models/department");
const validateMiddleware = require("../middleware/validation");
const sequelize = require("../db/index");
const mongoose = require("mongoose");
const path = require("path");
const MDDepartment = require("../models/departmentMD");
const MDEmployee = require("../models/EmployeeMD");
const fs = require("fs");
const axios = require ("axios");

exports.createEmployee = async (req, res) => {
  const { name, email, phone, gender, dob, dept_id } = req.body;
  const createdBy = req.userData.userId;
  console.log(name, email, phone, gender, dob, dept_id);
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded.' });
    }
    let emp_img = req.file.filename;
    if (process.env.DB_CONNECTION === "MD") {
      // For MongoDB
      const findEmail = await MDEmployee.findOne({ email });
      if (findEmail) {
        return res.status(400).json({ message: "Employee already exists with this email." });
      }

      const employee = await MDEmployee.create({
        name,
        email,
        phone,
        gender,
        dob,
        dept_id,
        isDeleted: 0,
        created_by: createdBy,
        created_at: new Date(),
        emp_img, // Added emp_img for MongoDB case
      });
      return res.json(employee);
    } else {
      const findEmail = await Employee.findOne({ where: { email } });
      if (findEmail) {
        return res.status(400).json({ message: "Employee already exists with this email." });
      }
      const employee = await Employee.create({
        name,
        email,
        phone,
        gender,
        dob,
        dept_id,
        isDeleted: 0,
        emp_img,
        created_by: createdBy,
        created_at: new Date(),
      });
      return res.json(employee);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


exports.createEmployeeAndDept = async (req, res) => {
  const { name, email, phone, gender, dob, dept_name } = req.body;
  const createdBy = req.userData.userId;

  if (process.env.DB_CONNECTION == "MD") {
    await createEmployeeAndDeptMongoDB(
      req,
      res,
      createdBy,
      name,
      email,
      phone,
      gender,
      dob,
      dept_name
    );
  } else {
    await createEmployeeAndDeptSequelize(
      req,
      res,
      createdBy,
      name,
      email,
      phone,
      gender,
      dob,
      dept_name
    );
  }
};

exports.getOneEmployees = async (req, res) => {
  const { id } = req.params;
  try {
    let employee;
    if (process.env.DB_CONNECTION === "MD") {
      employee = await MDEmployee.findOne({ _id: id }).populate(
        "dept_id",
        "name id"
      );
      employee = {
        ...employee.toObject(),
        department: {
          id: employee.dept_id._id,
          name: employee.dept_id.name,
        },
        id: employee._id,
      };
      delete employee._id;
      delete employee.dept_id;
    } else {
      employee = await Employee.findOne({
        where: { id: id },
        include: [
          {
            model: Department,
            attributes: ["name", "id"],
          },
        ],
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
      });
    }
    
    const filePath =
      employee.emp_img && `${process.env.IMAGE_PORT}${employee.emp_img}`;

    employee.emp_img = filePath;

    res.json(employee);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getEmpAndDep = async (req, res) => {
  const { search } = req.query;
  try {
    let employees;
    if (process.env.DB_CONNECTION == "MD") {
      employees = await MDEmployee.find().populate("dept_id", "name id");
      employees = employees.map((emp) => {
        const modifiedEmp = {
          ...emp.toObject(),
          department: {
            id: emp.dept_id._id,
            name: emp.dept_id.name,
          },
          id: emp._id,
        };
        delete modifiedEmp._id;
        delete modifiedEmp.dept_id;
        return modifiedEmp;
      });
    } else {
      employees = await Employee.findAll({
        include: [
          {
            model: Department,
            attributes: ["name", "id"],
          },
        ],
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
      });
    }

    let arr;
    if (search) {
      arr = employees.filter((e) => {
        return (
          e.name.toLowerCase().includes(search.toLowerCase()) ||
          e.email.toLowerCase().includes(search.toLowerCase())
        );
      });
    }

    arr = arr ? arr : employees;
 
    arr.map((e) => {
      const filePath = e.emp_img && `${process.env.IMAGE_PORT}${e.emp_img}`;

      return (e.emp_img = filePath);
    });

    res.json(arr);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getAllEmployees = async (req, res) => {
  try {
    const { search } = req.query;
    let employees;

    if (process.env.DB_CONNECTION === "MD") {
      employees = await MDEmployee.find();
      employees = employees.map((employee) => {
        const modifiedEmployee = {
          ...employee.toObject(),
          id: employee._id,
        };
        delete modifiedEmployee._id;
        return modifiedEmployee;
      });
    } else {
      employees = await Employee.findAll();
    }
    let arr = [];

    if (search) {
      arr = employees.filter(
        (e) =>
          e.name.toLowerCase().includes(search.toLowerCase()) ||
          e.email.includes(search.toLowerCase())
      );
    }

    arr = arr.length == 0 ? employees : arr;
    arr.map((e) => {
      const filePath = e.emp_img && `${process.env.IMAGE_PORT}${e.emp_img}`;

      return (e.emp_img = filePath);
    });

    res.json(arr);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateEmployee = async (req, res) => {
  const { id } = req.params;
  const { name, email, phone, gender, dob, dept_id } = req.body;
  const updatedBy = req.userData.userId;

  try {
    let employee;
    const emp_img = req.file.filename;
    console.log(name, email, phone, gender, dob, dept_id, emp_img);
    if (process.env.DB_CONNECTION === "MD") {
      employee = await MDEmployee.findByIdAndUpdate(
        id,
        {
          name,
          email,
          phone,
          gender,
          dob,
          dept_id,

          updated_at: new Date(),
          updated_by: updatedBy,
        },
        { new: true }
      );
    } else {
      employee = await Employee.findByPk(id);
      if (!employee) {
        return res.status(404).json({ message: "Employee not found" });
      }

      await employee.update({
        name,
        email,
        phone,
        gender,
        dob,
        dept_id,
        emp_img,
        updated_at: new Date(),
        updated_by: updatedBy,
      });
    }

    res.json(employee);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteEmployee = async (req, res) => {
  const { id } = req.params;
  const deletedBy = req.userData.userId;

  try {
    if (process.env.DB_CONNECTION == "MD") {
      const employee = await MDEmployee.findById(id);
      if (!employee) {
        return res.status(404).json({ message: "Employee not found" });
      }
      await MDEmployee.updateOne(
        { _id: id },
        {
          $set: {
            isDeleted: 1,
            deleted_by: deletedBy,
            deleted_at: new Date(),
          },
        }
      );
      res.json({ message: "Employee deleted successfully" });
    } else {
      const employee = await Employee.findByPk(id);
      if (!employee) {
        return res.status(404).json({ message: "Employee not found" });
      }
      await employee.update({
        isDeleted: 1,
        deleted_by: deletedBy,
        deleted_at: new Date(),
      });
      res.json({ message: "Employee deleted successfully" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
async function createEmployeeAndDeptMongoDB(
  req,
  res,
  createdBy,
  name,
  email,
  phone,
  gender,
  dob,
  dept_name
) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    let existingEmail = await MDEmployee.findOne({ email }).session(session);
    if (existingEmail) {
      await session.abortTransaction();
      session.endSession();
      return res
        .status(400)
        .json({ message: "Employee with this email already exists." });
    }

    let existingDepartment = await MDDepartment.findOne({
      name: dept_name,
    }).session(session);
    if (existingDepartment) {
      await session.abortTransaction();
      session.endSession();
      return res
        .status(400)
        .json({ message: "Department with this name already exists." });
    }

    const department = await MDDepartment.create(
      [
        {
          name: dept_name,
          isDeleted: 0,
          created_by: createdBy,
          created_at: new Date(),
        },
      ],
      { session }
    );

    let dp_id = department[0]._id.valueOf();

    if (!dp_id) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: "Department is not created!" });
    }

    const employeeData = {
      name,
      email,
      phone,
      gender,
      dob,
      isDeleted: 0,
      dept_id: dp_id,
      created_by: createdBy,
      created_at: new Date(),
    };

    const employee = await MDEmployee.create([employeeData], { session });

    await session.commitTransaction();
    session.endSession();

    res.json(employee);
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}

async function createEmployeeAndDeptSequelize(
  req,
  res,
  createdBy,
  name,
  email,
  phone,
  gender,
  dob,
  dept_name
) {
  let transaction = await sequelize.transaction();

  try {
    let existingEmail = await Employee.findOne({
      where: { email },
      transaction,
    });
    if (existingEmail) {
      await transaction.rollback();
      return res
        .status(400)
        .json({ message: "Employee with this email already exists." });
    }

    let existingDepartment = await Department.findOne({
      where: { name: dept_name },
      transaction,
    });
    if (existingDepartment) {
      await transaction.rollback();
      return res
        .status(400)
        .json({ message: "Department with this name already exists." });
    }

    const department = await Department.create(
      {
        name: dept_name,
        isDeleted: 0,
        created_by: createdBy,
        created_at: new Date(),
      },
      { transaction }
    );

    let dp_id = department.id;

    if (!dp_id) {
      await transaction.rollback();
      return res.status(400).json({ message: "Department is not created!" });
    }

    const employeeData = {
      name,
      email,
      phone,
      gender,
      dob,
      isDeleted: 0,
      dept_id: dp_id,
      created_by: createdBy,
      created_at: new Date(),
    };

    const employee = await Employee.create(employeeData, { transaction });

    await transaction.commit();

    res.json(employee);
  } catch (error) {
    await transaction.rollback();
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}
