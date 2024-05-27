import express, { Router, Request, Response, NextFunction } from "express";
import { body } from "express-validator";
const multipart = require('connect-multiparty');
const Resumable = require('../../resumable-node.js');

import authMiddleware from "../middleware/auth";
import validateMiddleware from "../middleware/validation";
import employeeController from "../controllers/employeeController";

const router: Router = express.Router();
const multipartMiddleware = multipart();
const resumableInstance = new Resumable({ storagePath: '../../folder' });

router.use(multipartMiddleware);
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
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      resumableInstance.post(req, async (status: string, filename: string, originalFilename: string, identifier: string) => {
        if (status === 'done') {
          console.log('File upload completed:', filename);

          // Run validation middleware
          await validateMiddleware(req, res, async () => {
            // Handle employee creation
            await employeeController.createEmployee(req, res, filename);
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

export default router;
