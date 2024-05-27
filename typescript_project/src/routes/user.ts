import express, { Router } from 'express';
import { body } from 'express-validator';
// import { RequestHandler } from 'express-validator';
import validateMiddleware from '../middleware/validation';
import userController from '../controllers/userController';

const router: Router = express.Router();

router.post(
  "/register",
  [
    body("username")
      .isLength({ min: 5 })
      .withMessage("Username must be at least 5 characters long"),
    body("email").isEmail().withMessage("Invalid email"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
  ],
  validateMiddleware,
  userController.register
);

router.post("/login", userController.login);

export default router;
