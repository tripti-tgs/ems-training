const bcrypt = require("bcrypt");
const { Op } = require("sequelize");
const User = require("../models/user");
const generateToken = require("../utils/jwt");

exports.register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ username }, { email }],
      },
      attributes: { exclude: ["createdAt", "updatedAt"] },
    });

    if (existingUser) {
      if (existingUser.username === username && existingUser.email === email) {
        return res.status(400).json({ message: "Username and email already exist!" });
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
      }
    );

    res.status(201).json({ message: "User registered successfully!", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.login = async (req, res) => {
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
};
