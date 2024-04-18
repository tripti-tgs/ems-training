const express = require("express");
const { body } = require("express-validator");
const authMiddleware = require("../middleware/auth");
const validateMiddleware = require("../middleware/validation");
const salaryController = require("../controllers/salaryController");

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
  salaryController.createSalary
);

router.get('/empandsalary', salaryController.getEmpAndSalary);

router.get("/", salaryController.getAllSalaries);

router.put(
  "/:id",
  [
    body("emp_id").isInt().withMessage("Invalid employee ID"),
    body("salary").isDecimal().withMessage("Invalid salary"),
    body("date").isDate().withMessage("Invalid date"),
  ],
  validateMiddleware,
  salaryController.updateSalary
);

router.delete("/:id", salaryController.deleteSalary);

module.exports = router;
