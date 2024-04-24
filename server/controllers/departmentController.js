const { Op } = require("sequelize");
const Department = require("../models/department");
const validateMiddleware = require("../middleware/validation");

exports.createDepartment = async (req, res) => {
  const { name } = req.body;
  const createdBy = req.userData.userId;

  try {
    const findname = await Department.findOne({
      where: { name },
      attributes: { exclude: ["createdAt", "updatedAt"] },
    });
    
    if (findname) {
      return res.status(400).json({
        message: "The department has been located. Please try another department name.",
      });
    }

    const department = await Department.create(
      { name, isDeleted: 0, created_by: createdBy, created_at: new Date() },
      {
        fields: ["name", "isDeleted", "created_by", "created_at"],
        attributes: { exclude: ["createdAt", "updatedAt"] },
      },
    );

    res.status(201).json(department);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getAllDepartments = async (req, res) => {
  try {
    const departments = await Department.findAll({
      // where: { isDeleted: { [Op.not]: 1 } },
    });

    res.json(departments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateDepartment = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  const updatedBy = req.userData.userId;

  try {
    const department = await Department.findByPk(id);
    if (!department) {
      return res.status(404).json({ message: "Department not found" });
    }

    await department.update(
      { name, updated_by: updatedBy, updated_at: new Date() },
    );

    res.json(department);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// exports.deleteDepartment = async (req, res) => {
//   const { id } = req.params;
//   const deletedBy = req.userData.userId;

//   try {
//     const department = await Department.findByPk(id);
//     if (!department) {
//       return res.status(404).json({ message: "Department not found" });
//     }

//     await department.update(
//       {
//         isDeleted: 1,
//         deleted_by: deletedBy,
//         deleted_at: new Date(),
//       },
//     );

//     res.json({ message: "Department deleted successfully" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server error" });
//   }
// };
exports.deleteDepartment = async (req, res) => {
  const { id } = req.params;
  const deletedBy = req.userData.userId;

  try {
    const result = await Department.deleteDepartment(id);
    if (result && result.result === "error") {
      return res.status(400).json({ message: result.message });
    }

    res.json({ message: "Department deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};