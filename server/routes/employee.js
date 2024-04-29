const express = require("express");
const { body } = require("express-validator");
const authMiddleware = require("../middleware/auth");
const validateMiddleware = require("../middleware/validation");
const employeeController = require("../controllers/employeeController");

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
    body("dept_id").notEmpty().withMessage("Invalid department ID"),
  ],
  validateMiddleware,
  employeeController.createEmployee
);

router.post(
  "/createempanddep",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Invalid email"),
    body("phone").isInt().withMessage("Invalid phone number"),
    body("gender").isInt().withMessage("Invalid gender"),
    body("dob").isDate().withMessage("Invalid date of birth"),
    body("dept_name").notEmpty().withMessage("Invalid department Name"),
  ],
  validateMiddleware,
  employeeController.createEmployeeAndDept
);

router.get("/empanddep", employeeController.getEmpAndDep);

router.get("/", employeeController.getAllEmployees);

router.get("/:id", employeeController.getOneEmployees);

router.put(
  "/:id",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Invalid email"),
    body("phone").isInt().withMessage("Invalid phone number"),
    body("gender").isInt().withMessage("Invalid gender"),
    body("dob").isDate().withMessage("Invalid date of birth"),
    body("dept_id").notEmpty().withMessage("Invalid department ID"),
  ],
  validateMiddleware,
  employeeController.updateEmployee
);

router.delete("/:id", employeeController.deleteEmployee);

module.exports = router;
