import express, { Router } from "express";
import { body } from "express-validator";
import authMiddleware from"../middleware/auth";
import validateMiddleware from"../middleware/validation";
import departmentController from"../controllers/departmentController";

const router:Router = express.Router();

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

export default router;
