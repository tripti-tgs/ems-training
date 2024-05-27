import { Request, Response } from "express";
import Employee from "../models/employee";
import { createQuery, findOneQuery } from "../seqQueryComponent/allQuery";
import logger from '../logs/logger';

const checkIfEmailExists = async (email: string): Promise<boolean> => {
  const existingEmployee = await findOneQuery(Employee, `SELECT * FROM employee WHERE email = '${email}';`);
  return !!existingEmployee;
};

export const createEmployee = async (req: Request, res: Response, filename: string): Promise<Response | void> => {
  try {
    const { name, email, phone, gender, dob, dept_id } = req.body;
    const createdBy: number = req.body.userData.userId;

    if (!filename) {
      return res.status(400).json({ message: 'No file uploaded.' });
    }

    if (await checkIfEmailExists(email)) {
      return res.status(400).json({ message: "Employee already exists with this email." });
    }

    const data = {
      name,
      email,
      phone,
      gender,
      dob,
      dept_id,
      isDeleted: 0,
      emp_img: filename,
      created_by: createdBy,
      created_at: new Date(),
    };

    const employee = await createQuery(Employee, data);
    return res.json(employee);
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

export default { createEmployee };
