const express = require("express");
const { body } = require("express-validator");
const Employee = require("../models/employee");
const Salary = require("../models/salary");
const Department = require("../models/department");
const authMiddleware = require("../middleware/auth");
const validateMiddleware = require("../middleware/validation");
const { Op } = require("sequelize");
const sequelize = require("../db/index");

const router = express.Router();

router.use(authMiddleware);

router.post(
  "/create",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Invalid email"),
    body("phone").isInt().withMessage("Invalid phone number"),
    body("gender").isInt().withMessage("Invalid gender"),
    body("dob").isDate().withMessage("Invalid date of birth"),
    body("dept_id").isInt().withMessage("Invalid department ID"),
  ],
  validateMiddleware,
  async (req, res) => {
    const { name, email, phone, gender, dob, dept_id, dept_name } = req.body;
    const createdBy = req.userData.userId;

    const transaction = await sequelize.transaction();

    try {
      const findemail = await Employee.findOne({
        where: { email },
        attributes: { exclude: ["createdAt", "updatedAt"] },
      });
      if (findemail) {
        await transaction.rollback();
        return res.status(400).json({
          message:
            "Employee is already present, please try using a different email.",
        });
      }

      let id = dept_id;
      let deptName = dept_name;
      const finddept_id = await Department.findOne({
        where: { id },
        attributes: { exclude: ["createdAt", "updatedAt"] },
      });
      if (!finddept_id) {
        if (deptName) {
          const department = await Department.create(
            {
              name: deptName,
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
          const employee = await add(
            name,
            email,
            phone,
            gender,
            dob,
            department?.dataValues?.id,
            createdBy,
            transaction
          );
          await transaction.commit();
          res.status(201).json(employee);
        } else {
          await transaction.rollback();
          return res.status(400).json({
            message: "Please provide the name of the department.",
          });
        }
      } else {
        const employee = await add(
          name,
          email,
          phone,
          gender,
          dob,
          id,
          createdBy,
          transaction
        );
        await transaction.commit();
        res.status(201).json(employee);
      }
    } catch (error) {
      console.error(error);
      await transaction.rollback();
      res.status(500).json({ message: "Server error" });
    }
  }
);

async function add(
  name,
  email,
  phone,
  gender,
  dob,
  dept_id=1,
  createdBy,
  transaction
) {
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
      transaction,
    }
  );
  return employee;
}

router.get("/empanddep", async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const employees = await Employee.findAll({
      where: { isDeleted: { [Op.not]: 1 } },
      include: [
        {
          model: Department,
          attributes: ["name"],
          transaction,
        },
      ],
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
      transaction,
    });

    await transaction.commit();

    res.json(employees);
  } catch (error) {
    console.error(error);
    await transaction.rollback();
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/", async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const employees = await Employee.findAll({
      where: { isDeleted: { [Op.not]: 1 } },
      transaction,
    });

    await transaction.commit();

    res.json(employees);
  } catch (error) {
    console.error(error);
    await transaction.rollback();
    res.status(500).json({ message: "Server error" });
  }
});

router.put(
  "/:id",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Invalid email"),
    body("phone").isInt().withMessage("Invalid phone number"),
    body("gender").isInt().withMessage("Invalid gender"),
    body("dob").isDate().withMessage("Invalid date of birth"),
    body("dept_id").isInt().withMessage("Invalid department ID"),
  ],
  validateMiddleware,
  async (req, res) => {
    const { id } = req.params;
    const { name, email, phone, gender, dob, dept_id } = req.body;
    const updatedBy = req.userData.userId;

    const transaction = await sequelize.transaction();

    try {
      const employee = await Employee.findByPk(id, { transaction });
      if (!employee) {
        await transaction.rollback();
        return res.status(404).json({ message: "Employee not found" });
      }

      await employee.update(
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
        { transaction }
      );

      await transaction.commit();

      res.json(employee);
    } catch (error) {
      console.error(error);
      await transaction.rollback();
      res.status(500).json({ message: "Server error" });
    }
  }
);

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const deletedBy = req.userData.userId;

  const transaction = await sequelize.transaction();

  try {
    const employee = await Employee.findByPk(id, { transaction });
    if (!employee) {
      await transaction.rollback();
      return res.status(404).json({ message: "Employee not found" });
    }

    await employee.update(
      { isDeleted: 1, deleted_by: deletedBy, deleted_at: new Date() },
      { transaction }
    );

    await transaction.commit();

    res.json({ message: "Employee deleted successfully" });
  } catch (error) {
    console.error(error);
    await transaction.rollback();
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
