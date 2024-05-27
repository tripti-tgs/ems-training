import bcrypt from "bcrypt";
import { Request, Response } from "express";
import User from "../models/user";
import MDUser from "../models/userMD";
import generateToken from "../utils/jwt";
import { createQuery, findOneQuery } from "../seqQueryComponent/allQuery"
import logger from "../logs/logger"

const getUserByUsername = async (username: string) => {
  if (process.env.DB_CONNECTION === "MD") {
    return await MDUser.findOne({ where: { username } });
  } else {
    return await findOneQuery(User, `SELECT * FROM users WHERE username = '${username}';`);
  }
};

const register = async (req: Request, res: Response): Promise<Response | void> => {
  const { username, email, password } = req.body;
  try {
    const existingUser = await getUserByUsername(username);
    
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
    
    let data = {
      username,
      email,
      password: hashedPassword,
    }
    
    await createQuery(process.env.DB_CONNECTION === "MD" ? MDUser : User, data);
    
    res.status(201).json({ message: "User registered successfully!" });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const login = async (req: Request, res: Response): Promise<Response | void> => {
  const { username, password } = req.body;
  try {
    const user = await getUserByUsername(username);
    
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
    logger.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export default {
  login,
  register
}
