const express = require("express");
const { body } = require("express-validator");
const authMiddleware = require("../middleware/auth");
const validateMiddleware = require("../middleware/validation");
const employeeController = require("../controllers/employeeController");
const multipart = require('connect-multiparty');
const multer = require("multer");
var resumable = require('../resumable-node.js')('/tmp/resumable.js/');
const path = require("path");
const fs = require("fs").promises;
const router = express.Router();

router.use(multipart());
router.use(authMiddleware);

router.post(
  "/create",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Invalid email"),
    body("phone").isInt().withMessage("Invalid phone number"),
    body("gender").isInt().withMessage("Invalid gender"),
    body("dob").isDate().withMessage("Invalid date of birth"),
    body("dept_id").notEmpty().withMessage("Department ID is required"),
  ],
  async (req, res) => {
    try {
      await resumable.post(req, async (status, filename, original_filename, identifier) => {
        console.log(status)
        if (status === 'done') {
          console.log('File upload completed:', filename);
          await validateMiddleware(req, res, async () => {
            await employeeController.createEmployee(req, res,filename);
          });
        } else {
          console.log('Chunk uploaded:', filename);
        }
      });
    } catch (err) {
      console.error('Error uploading file:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
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
  async (req, res) => {
    try {
      await resumable.post(req, async (status, filename, original_filename, identifier) => {
        console.log(status)
        if (status === 'done') {
          console.log('File upload completed:', filename);
          await validateMiddleware(req, res, async () => {
            await employeeController.createEmployeeAndDept(req, res, filename);
          });
        } else {
          console.log('Chunk uploaded:', filename);
        }
      });
    } catch (err) {
      console.error('Error uploading file:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
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
  async (req, res) => {
    try {
      await resumable.post(req, async (status, filename, original_filename, identifier) => {
        console.log(status)
        if (status === 'done') {
          console.log('File upload completed:', filename);
          await validateMiddleware(req, res, async () => {
            await employeeController.updateEmployee(req, res, filename);
          });
        } else {
          console.log('Chunk uploaded:', filename);
        }
      });
    } catch (err) {
      console.error('Error uploading file:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);
router.delete("/:id", employeeController.deleteEmployee);

module.exports = router;
