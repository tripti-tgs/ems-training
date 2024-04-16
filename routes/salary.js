const express = require("express");
const { body } = require("express-validator");
const Salary = require("../models/salary");
const Employee = require("../models/employee");
const Department = require('../models/department');
const authMiddleware = require("../middleware/auth");
const validateMiddleware = require("../middleware/validation");
const { Op } = require("sequelize");
const router = express.Router();

router.use(authMiddleware);

router.post(
  "/create",
  [
    body("emp_id").isInt().withMessage("Invalid employee ID"),
    body("salary").isDecimal().withMessage("Invalid salary"),
    body("date").isDate().withMessage("Invalid date"),
  ],
  validateMiddleware,
  async (req, res) => {
    const { emp_id, salary, date } = req.body;
    const createdBy = req.userData.userId;

    const transaction = await sequelize.transaction();

    try {
      const salaryRecord = await Salary.create(
        { emp_id, salary, date, isDeleted: 0, created_by: createdBy, created_at: new Date() },
        {
          fields: ["emp_id", "date", "salary", "isDeleted", "created_by", "created_at"],
          attributes: { exclude: ["createdAt", "updatedAt"] },
          transaction,
        }
      );

      await transaction.commit();

      res.status(201).json(salaryRecord);
    } catch (error) {
      console.error(error);
      await transaction.rollback();
      res.status(500).json({ message: "Server error" });
    }
  }
);

router.get('/empandsalary', async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const employees = await Salary.findAll({
      where: { isDeleted: { [Op.not]: 1 } },
      include: [
        {
          model: Employee,
          attributes: [
            "name",
            "email",
            "phone",
            "gender",
            "dob",
          ],
          required: false,
          transaction,
        }
      ],
      attributes: {
        exclude: ['createdAt', 'updatedAt', 'created_by', 'updated_by', 'deleted_by', 'dept_id']
      },
      transaction,
    });

    await transaction.commit();

    res.json(employees);
  } catch (error) {
    console.error(error);
    await transaction.rollback();
    res.status(500).json({ message: 'Server error' });
  }
});

router.get("/", async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const salaries = await Salary.findAll({
      where: { isDeleted: { [Op.not]: 1 } },
      transaction,
    });

    await transaction.commit();

    res.json(salaries);
  } catch (error) {
    console.error(error);
    await transaction.rollback();
    res.status(500).json({ message: "Server error" });
  }
});

router.put(
  "/:id",
  [
    body("emp_id").isInt().withMessage("Invalid employee ID"),
    body("salary").isDecimal().withMessage("Invalid salary"),
    body("date").isDate().withMessage("Invalid date"),
  ],
  validateMiddleware,
  async (req, res) => {
    const { id } = req.params;
    const { emp_id, salary, date } = req.body;
    const updatedBy = req.userData.userId;

    const transaction = await sequelize.transaction();

    try {
      const salaryRecord = await Salary.findByPk(id, { transaction });
      if (!salaryRecord) {
        await transaction.rollback();
        return res.status(404).json({ message: "Salary record not found" });
      }

      await salaryRecord.update({
        emp_id,
        salary,
        date,
        updated_at: new Date(),
        updated_by: updatedBy,
      }, { transaction });

      await transaction.commit();

      res.json(salaryRecord);
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
    const salaryRecord = await Salary.findByPk(id, { transaction });
    if (!salaryRecord) {
      await transaction.rollback();
      return res.status(404).json({ message: "Salary record not found" });
    }

    await salaryRecord.update({
      isDeleted: 1,
      deleted_by: deletedBy,
      deleted_at: new Date(),
    }, { transaction });

    await transaction.commit();

    res.json({ message: "Salary record deleted successfully" });
  } catch (error) {
    console.error(error);
    await transaction.rollback();
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
