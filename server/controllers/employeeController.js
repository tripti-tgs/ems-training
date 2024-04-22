const { Op } = require("sequelize");
const Employee = require("../models/employee");
const Department = require("../models/department");
const validateMiddleware = require("../middleware/validation");
const sequelize = require("../db/index");
exports.createEmployee = async (req, res) => {
  const { name, email, phone, gender, dob, dept_id } = req.body;
  // const createdBy = req.userData.userId;
  const createdBy = 7;
  try {
    const findemail = await Employee.findOne({
      where: { email },
      attributes: { exclude: ["createdAt", "updatedAt"] },
    });

    if (findemail) {
      return res.status(400).json({
        message:
          "Employee is already present, please try using a different email.",
      });
    }

    const finddept_id = await Department.findOne({
      where: { id: dept_id },
      attributes: { exclude: ["createdAt", "updatedAt"] },
    });

    if (!finddept_id) {
      return res.status(400).json({
        message: "Department Id is not present",
      });
    }

    const employee = await Employee.create(
      {
        name,
        email,
        phone,
        gender,
        dob,
        isDeleted: 0,
        dept_id,
        created_by: createdBy,
        created_at: new Date(),
      },
      {
        fields: [
          "name",
          "email",
          "phone",
          "gender",
          "dob",
          "isDeleted",
          "dept_id",
          "created_by",
          "created_at",
        ],
        attributes: { exclude: ["createdAt", "updatedAt"] },
      }
    );

    res.json(employee);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.createEmployeeAndDept = async (req, res) => {
  const { name, email, phone, gender, dob, dept_name } = req.body;
  const createdBy = req.userData.userId;

  const transaction = await sequelize.transaction();

  try {
    const findemail = await Employee.findOne({
      where: { email },
      attributes: { exclude: ["createdAt", "updatedAt"] },
      transaction,
    });

    if (findemail) {
      await transaction.rollback();
      return res.status(400).json({
        message:
          "Employee is already present, please try using a different email.",
      });
    }

    const findname = await Department.findOne({
      where: { name: dept_name },
      attributes: { exclude: ["createdAt", "updatedAt"] },
      transaction,
    });

    if (findname) {
      await transaction.rollback();
      return res.status(400).json({
        message:
          "The department has been located. Please try another department name.",
      });
    }

    const department = await Department.create(
      {
        name: dept_name,
        isDeleted: 0,
        created_by: createdBy,
        created_at: new Date(),
      },
      {
        fields: ["name", "isDeleted", "created_by", "created_at"],
        attributes: { exclude: ["createdAt", "updatedAt"] },
        transaction,
      }
    );

    const employee = await Employee.create(
      {
        name,
        email,
        phone,
        gender,
        dob,
        isDeleted: 0,
        dept_id: department?.dataValues?.id,
        created_by: createdBy,
        created_at: new Date(),
      },
      {
        fields: [
          "name",
          "email",
          "phone",
          "gender",
          "dob",
          "isDeleted",
          "dept_id",
          "created_by",
          "created_at",
        ],
        attributes: { exclude: ["createdAt", "updatedAt"] },
        transaction,
      }
    );

    await transaction.commit();

    res.json(employee);
  } catch (error) {
    await transaction.rollback();
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getOneEmployees = async (req, res) => {
  const { id } = req.params;
  try {
    const employees = await Employee.findOne({
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

    res.json(employees);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
exports.getEmpAndDep = async (req, res) => {
  const { search } = req.query;

  try {
    const employees = await Employee.findAll({
      // where: { isDeleted: { [Op.not]: 1 } },
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
    res.json(arr);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// exports.getAllEmployees = async (req, res) => {
//   try {
//     const employees = await Employee.findAll({
//       where: { isDeleted: { [Op.not]: 1 } },
//     });

// const whereClause = {
//   isDeleted: { [Op.not]: 1 },
// };

// if (firstName) {
//   whereClause.firstName = { [Op.iLike]: `%${firstName}%` };
// }

// if (lastName) {
//   whereClause.lastName = { [Op.iLike]: `%${lastName}%` };
// }

// if (email) {
//   whereClause.email = { [Op.iLike]: `%${email}%` };
// }
//     res.json(employees);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

exports.getAllEmployees = async (req, res) => {
  try {
    const { search } = req.query;

    const employees = await Employee.findAll();

    let arr = employees.filter((e) => {
      return (
        e.name.toLowerCase().includes(toLowerCase().search) ||
        e.email.includes(toLowerCase().search)
      );
    });

    arr = arr.length == 0 ? employees : arr;
    res.json(arr);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateEmployee = async (req, res) => {
  const { id } = req.params;
  const { name, email, phone, gender, dob, dept_id } = req.body;
  // const updatedBy = req.userData.userId;
  const updatedBy = 6;
  try {
    const employee = await Employee.findByPk(id);
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
      updated_at: new Date(),
      updated_by: updatedBy,
    });

    res.json(employee);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteEmployee = async (req, res) => {
  const { id } = req.params;
  // const deletedBy = req.userData.userId;
  const deletedBy = 9;
  try {
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
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
