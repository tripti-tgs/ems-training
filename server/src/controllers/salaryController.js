const { Op } = require("sequelize");
const Salary = require("../models/salary");
const validateMiddleware = require("../middleware/validation");
const Employee = require("../models/employee");
const MDSalary = require("../models/salaryMD");
const MDEmployee = require("../models/EmployeeMD");

exports.createSalary = async (req, res) => {
  const { emp_id, salary, date } = req.body;
  const createdBy = req.userData.userId;
  let id = emp_id;
  try {
    let salaryRecord;
    if (process.env.DB_CONNECTION == "MD") {
      const findEmp_id = await MDEmployee.findById(id);
      if (!findEmp_id) {
        return res.status(400).json({
          message: "Employee id is not present!",
        });
      }
      salaryRecord = await MDSalary.create({
        emp_id,
        salary,
        date,
        isDeleted: 0,
        created_by: createdBy,
        created_at: new Date(),
      });
    } else {
      const findEmp_id = await Employee.findOne({
        where: { id },
        attributes: { exclude: ["createdAt", "updatedAt"] },
      });
      if (!findEmp_id) {
        return res.status(400).json({
          message: "Employee id is not present!",
        });
      }

      salaryRecord = await Salary.create({
        emp_id,
        salary,
        date,
        isDeleted: 0,
        created_by: createdBy,
        created_at: new Date(),
      }, {
        fields: [
          "emp_id",
          "date",
          "salary",
          "isDeleted",
          "created_by",
          "created_at",
        ],
        attributes: { exclude: ["createdAt", "updatedAt"] },
      });
    }
    res.status(201).json(salaryRecord);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


exports.getAllSalaries = async (req, res) => {
  try {
    let salaries;
    if (process.env.DB_CONNECTION == "MD") {
      salaries = await MDSalary.find({ isDeleted: { $ne: 1 } });
      salaries = salaries.map(s => {
        const modifieSalaries = {
          ...s.toObject(),
          id: s._id 
        };
        delete modifieSalaries._id; 
        return modifieSalaries;
      });
    } else {
      salaries = await Salary.findAll({
        where: { isDeleted: { [Op.not]: 1 } },
      });
    }
    res.json(salaries);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateSalary = async (req, res) => {
  const { id } = req.params;
  const { emp_id, salary, date } = req.body;
  const updatedBy = req.userData.userId;
  try {
    let salaryRecord;
    if (process.env.DB_CONNECTION === "MD") {
      salaryRecord = await MDSalary.findByIdAndUpdate(id, {
        emp_id,
        salary,
        date,
        updated_at: new Date(),
        updated_by: updatedBy,
      }, { new: true });
    } else {
      salaryRecord = await Salary.findByPk(id);
      if (!salaryRecord) {
        return res.status(404).json({ message: "Salary record not found" });
      }
      await salaryRecord.update({
        emp_id,
        salary,
        date,
        updated_at: new Date(),
        updated_by: updatedBy,
      });
    }
    res.json(salaryRecord);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteSalary = async (req, res) => {
  const { id } = req.params;
  const deletedBy = req.userData.userId;
  try {
    let salaryRecord;
    if (process.env.DB_CONNECTION === "MD") {
      salaryRecord = await MDSalary.findByIdAndUpdate(id, {
        isDeleted: 1,
        deleted_by: deletedBy,
        deleted_at: new Date(),
      }, { new: true });
    } else {
      salaryRecord = await Salary.findByPk(id);
      if (!salaryRecord) {
        return res.status(404).json({ message: "Salary record not found" });
      }
      await salaryRecord.update({
        isDeleted: 1,
        deleted_by: deletedBy,
        deleted_at: new Date(),
      });
    }
    res.json({ message: "Salary record deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

