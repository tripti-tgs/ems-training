const express = require("express");
const { body } = require("express-validator");
const validateMiddleware = require("../middleware/validation");
const userController = require("../controllers/userController");

const router = express.Router();

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

module.exports = router;
