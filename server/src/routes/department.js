const express = require("express");
const { body } = require("express-validator");
const authMiddleware = require("../middleware/auth");
const validateMiddleware = require("../middleware/validation");
const departmentController = require("../controllers/departmentController");

const router = express.Router();

router.use(authMiddleware);

router.post(
  "/create",
  [body("name").notEmpty().withMessage("Name is required")],
  validateMiddleware,
  departmentController.createDepartment
);

router.get("/", departmentController.getAllDepartments);

router.put(
  "/:id",
  [body("name").notEmpty().withMessage("Name is required")],
  validateMiddleware,
  departmentController.updateDepartment
);

router.delete("/:id", departmentController.deleteDepartment);

module.exports = router;
