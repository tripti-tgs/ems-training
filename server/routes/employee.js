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


// const storage = multer.diskStorage({
 
//   destination: (res, file, cb) => {
//     const uploadPath = process.env.IMAGE_DISK;
//     fs.mkdir(uploadPath, { recursive: true })
//       .then(() => cb(null, uploadPath))
//       .catch((err) => cb(err));
//   },
//   filename: (req, file, cb) => {
//     const filename = file.originalname;
//     cb(null, filename);
//   },
// });
// let upload = multer({ storage: storage });

router.post(
  "/create",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Invalid email"),
    body("phone").isInt().withMessage("Invalid phone number"),
    body("gender").isInt().withMessage("Invalid gender"),
    body("dob").isDate().withMessage("Invalid date of birth"),
    body("dept_id").notEmpty().withMessage("Department ID is required"),
    // body("emp_img").notEmpty().withMessage("Image is required"),
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

// router.post(
//   "/createempanddep",

//   [
//     body("name").notEmpty().withMessage("Name is required"),
//     body("email").isEmail().withMessage("Invalid email"),
//     body("phone").isInt().withMessage("Invalid phone number"),
//     body("gender").isInt().withMessage("Invalid gender"),
//     body("dob").isDate().withMessage("Invalid date of birth"),
//     body("dept_name").notEmpty().withMessage("Invalid department Name"),
//   ],
//   validateMiddleware,
//   employeeController.createEmployeeAndDept
// );

router.get("/empanddep", employeeController.getEmpAndDep);

// router.get("/", employeeController.getAllEmployees);

router.get("/:id", employeeController.getOneEmployees);

// router.put(
//   "/:id",
//   upload.single("emp_img"),
//   [
//     body("name").notEmpty().withMessage("Name is required"),
//     body("email").isEmail().withMessage("Invalid email"),
//     body("phone").isInt().withMessage("Invalid phone number"),
//     body("gender").isInt().withMessage("Invalid gender"),
//     body("dob").isDate().withMessage("Invalid date of birth"),
//     body("dept_id").notEmpty().withMessage("Invalid department ID"),
//   ],
//   validateMiddleware,
//   employeeController.updateEmployee
// );

// router.delete("/:id", employeeController.deleteEmployee);

module.exports = router;
