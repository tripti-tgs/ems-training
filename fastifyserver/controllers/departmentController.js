const { Op } = require("sequelize");
const Department = require("../models/department");
const validateMiddleware = require("../middleware/validation");
const mongoose = require("mongoose");
const MDEmployee = require("../models/EmployeeMD");
const MDDepartment = require("../models/departmentMD");

exports.createDepartment = async (req, res) => {
  const { name } = req.body;
  const createdBy = req.userData.userId;
  try {
    let department;
    if (process.env.DB_CONNECTION === "MD") {
      department = await MDDepartment.findOne({ name });
    } else {
      department = await Department.findOne({
        where: { name },
        attributes: { exclude: ["createdAt", "updatedAt"] },
      });
    }

    if (department) {
      return res.code(400).send({
        message:
          "The department has been located. Please try another department name.",
      });
    }

    if (process.env.DB_CONNECTION == "MD") {
      department = await MDDepartment.create({
        name,
        isDeleted: 0,
        created_by: createdBy,
        created_at: new Date(),
      });
    } else {
      department = await Department.create(
        { name, isDeleted: 0, created_by: createdBy, created_at: new Date() },
        {
          fields: ["name", "isDeleted", "created_by", "created_at"],
          attributes: { exclude: ["createdAt", "updatedAt"] },
        }
      );
    }

    res.code(201).send(department);
  } catch (error) {
    console.error(error);
    res.code(500).send({ message: "Server error" });
  }
};

exports.getAllDepartments = async (req, res) => {
  try {
    let departments;
    if (process.env.DB_CONNECTION == "MD") {
      departments = await MDDepartment.find();
      departments = departments.map(department => {
        const modifiedDepartment = {
          ...department.toObject(),
          id: department._id 
        };
        delete modifiedDepartment._id; 
        return modifiedDepartment;
      });
    } else {
      departments = await Department.findAll({
        // where: { isDeleted: { [Op.not]: 1 } },
      });
    }

    res.send(departments);
  } catch (error) {
    console.error(error);
    res.code(500).send({ message: "Server error" });
  }
};

exports.updateDepartment = async (req, res) => {
  const { id } = req.params;
  const { name, db } = req.body;
  const updatedBy = req.userData.userId;

  try {
    let department;
    if (process.env.DB_CONNECTION == "MD") {
      department = await MDDepartment.findByIdAndUpdate(
        id,
        { name, updated_by: updatedBy, updated_at: new Date() },
        { new: true }
      );
    } else {
      department = await Department.findByPk(id);
      if (!department) {
        return res.code(404).send({ message: "Department not found" });
      }

      await department.update({
        name,
        updated_by: updatedBy,
        updated_at: new Date(),
      });
    }

    res.send(department);
  } catch (error) {
    console.error(error);
    res.code(500).send({ message: "Server error" });
  }
};

exports.deleteDepartment = async (req, res) => {
  const { id } = req.params;
  const deletedBy = req.userData.userId;

  try {
    if (process.env.DB_CONNECTION == "MD") {
      const isDepartmentReferenced = await checkIfDepartmentReferenced(id);

      if (isDepartmentReferenced) {
        return res
          .code(400)
          .send({ message: "Department is used in employees table" });
      }
      let department = await MDDepartment.findOne({ _id: id });
      if (!department) {
        return res.code(404).send({ message: "Department not found" });
      }
      await MDDepartment.updateOne(
        { _id: id },
        { isDeleted: 1, deleted_by: deletedBy, deleted_at: new Date() }
      );
      res.send({ message: "Department deleted successfully" });
      
    } else {
      const result = await Department.deleteDepartment(id);
      if (result && result.result === "error") {
        return res.code(400).send({ message: result.message });
      }
      res.send({ message: "Department deleted successfully" });
    }
  } catch (error) {
    console.error(error);
    res.code(500).send({ message: "Server error" });
  }
};
async function checkIfDepartmentReferenced(departmentId) {
  const employees = await MDEmployee.find({ dept_id: departmentId });
  return employees.length > 0;
}
