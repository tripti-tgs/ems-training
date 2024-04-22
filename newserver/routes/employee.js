const express = require("express");

const employeeController = require("../controllers/employeeController");

const router = express.Router();


router.post("/",
  employeeController.createEmployee
);
router.get("/", employeeController.getAllEmployees);

router.get("/:id", employeeController.getOneEmployees);

router.delete("/:id", employeeController.deleteEmployee);

module.exports = router;
