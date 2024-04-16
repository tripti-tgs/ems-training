const express = require("express");
const { body } = require("express-validator");
const Department = require("../models/department");
const authMiddleware = require("../middleware/auth");
const validateMiddleware = require("../middleware/validation");
const sequelize = require("../db/index");
const router = express.Router();

router.use(authMiddleware);

router.post(
  "/create",
  [body("name").notEmpty().withMessage("Name is required")],
  validateMiddleware,
  async (req, res) => {
    const { name } = req.body;
    const createdBy = req.userData.userId;

    let transaction;
    try {
      transaction = await sequelize.transaction();
      const findname = await Department.findOne({
        where: { name },
        attributes: { exclude: ["createdAt", "updatedAt"] },
      });
      if (findname) {
        await transaction.rollback();
        return res
          .status(400)
          .json({
            message:
              "The department has been located. Please try another department name.",
          });
      }
      const department = await Department.create(
        { name,isDeleted:0,created_by: createdBy, created_at: new Date() },
        {
          fields: ["name", "isDeleted","created_by", "created_at"],
          attributes: { exclude: ["createdAt", "updatedAt"] },
        },
        { transaction }
      );

      await transaction.commit();

      res.status(201).json(department);
    } catch (error) {
      if (transaction) {
        await transaction.rollback();
      }
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

router.get("/", async (req, res) => {
  let transaction;
  try {
    transaction = await sequelize.transaction();
    const departments = await Department.findAll({
      where: { isDeleted: { [Op.not]: 1 } },
      transaction: transaction
    });
    
    await transaction.commit();
    res.json(departments);
  } catch (error) {
    if (transaction) {
      await transaction.rollback();
    }
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.put(
  "/:id",
  [body("name").notEmpty().withMessage("Name is required")],
  validateMiddleware,
  async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    const updatedBy = req.userData.userId;

    let transaction;

    try {
      transaction = await sequelize.transaction();
      const department = await Department.findByPk(id);
      if (!department) {
        await transaction.rollback();
        return res.status(404).json({ message: "Department not found" });
      }

      await department.update(
        { name, updated_by: updatedBy, updated_at: new Date() },
        { transaction }
      );

      await transaction.commit(); 

      res.json(department);
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
    const department = await Department.findByPk(id);
    if (!department) {
      await transaction.rollback(); 
      return res.status(404).json({ message: "Department not found" });
    }

    await department.update(
      {
        isDeleted: 1,
        deleted_by: deletedBy,
        deleted_at: new Date(),
      },
      { transaction: transaction }
    );

    await transaction.commit();
    res.json({ message: "Department deleted successfully" });
  } catch (error) {
    console.error(error);
    await transaction.rollback(); 
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
