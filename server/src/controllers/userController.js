const bcrypt = require("bcrypt");
const { Op } = require("sequelize");
const User = require("../models/user");
const generateToken = require("../utils/jwt");

const MDUser = require("../models/userMD");

exports.register = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    let existingUser;
    if (process.env.DB_CONNECTION == "MD") {
      existingUser = await MDUser.findOne({
        $or: [{ username }, { email }],
      });
    } else {
      existingUser = await User.findOne({
        where: {
          [Op.or]: [{ username }, { email }],
        },
        attributes: { exclude: ["createdAt", "updatedAt"] },
      });
    }

    if (existingUser) {
      if (existingUser.username === username && existingUser.email === email) {
        return res.status(400).json({ message: "Username and email already exist!" });
      } else if (existingUser.username === username) {
        return res.status(400).json({ message: "Username already exists!" });
      } else if (existingUser.email === email) {
        return res.status(400).json({ message: "Email already exists!" });
      }
    }


    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const userInfo = await (process.env.DB_CONNECTION === "MD" ? MDUser : User).create({
      username,
      email,
      password: hashedPassword,
    });
    res.status(201).json({ message: "User registered successfully!"});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    let user;
    if (process.env.DB_CONNECTION == "MD") {
      user = await MDUser.findOne({ username });
    } else {
      user = await User.findOne({
        where: { username },
        attributes: { exclude: ["createdAt", "updatedAt"] },
      });
    }

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
