const express = require("express");
const bcrypt = require("bcrypt");
const { body } = require("express-validator");
const User = require("../models/user");
const generateToken = require("../utils/jwt");
const validateMiddleware = require("../middleware/validation");
const sequelize = require("../db/index");
const { Op } = require("sequelize");

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
  async (req, res) => {
    let { username, email, password } = req.body;

    try {
      const result = await sequelize.transaction(async t => {
        const existingUser = await User.findOne({
          where: {
            [Op.or]: [{ username }, { email }],
          },
          attributes: { exclude: ["createdAt", "updatedAt"] },
          transaction: t
        });
        

      if (existingUser) {
        if (
          existingUser.username === username &&
          existingUser.email === email
        ) {
          return res
            .status(400)
            .json({ message: "Username and email already exist!" });
        } else if (existingUser.username === username) {
          return res.status(400).json({ message: "Username already exists!" });
        } else if (existingUser.email === email) {
          return res.status(400).json({ message: "Email already exists!" });
        }
      }
      const user = await User.create(
        {
          username,
          email,
          password,
        },
        {
          fields: ["username", "email", "password"],
          attributes: { exclude: ["createdAt", "updatedAt"] },
          transaction: t,
        }
      );
      

      // const token = generateToken(user);

      // res.status(201).json({ token });
      return user;
  });
      res.status(201).json({ message:"User registered successfully!"});
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({
      where: { username },
      attributes: { exclude: ["createdAt", "updatedAt"] },
    });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user);

    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
