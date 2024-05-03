const express = require("express");
const { body } = require("express-validator");
const authMiddleware = require("../middleware/auth");
const validateMiddleware = require("../middleware/validation");
const employeeController = require("../controllers/employeeController");

const multer = require("multer");
const path = require("path");
const fs = require("fs").promises;
const Resumable = require("resumablejs");
const router = express.Router();

router.use(authMiddleware);


const storage = multer.diskStorage({
  destination: (res, file, cb) => {
    const uploadPath = "D:/EMS_images/upload";
    fs.mkdir(uploadPath, { recursive: true })
      .then(() => cb(null, uploadPath))
      .catch((err) => cb(err));
  },
  filename: (req, file, cb) => {
    const filename = file.originalname;
    cb(null, filename);
  },
  // fileFilter:(req,file,cb)=>{
  //   let ext =path.extname(file.originalname);
  //   if(ext != ".png" && ext != ".jpg" && ext != ".gif" )
  // }
});
const upload = multer({ storage: storage });

router.post(
  "/create",
  upload.single("emp_img"),
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Invalid email"),
    body("phone").isInt().withMessage("Invalid phone number"),
    body("gender").isInt().withMessage("Invalid gender"),
    body("dob").isDate().withMessage("Invalid date of birth"),
    body("dept_id").notEmpty().withMessage("Department ID is required"),
    // body("emp_img").notEmpty().withMessage("Image is required"),
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
  upload.single("emp_img"),
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
