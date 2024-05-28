import { Request, Response } from 'express';
import Department from "../models/department";
import { createQuery, findOneQuery, findAllQuery, findByPkQuery, updateQuery, deleteDataAll ,deleteData} from "../seqQueryComponent/allQuery"
import logger from '../logs/logger';
import sequelize from "../db/index"

const createDepartment = async (req: any, res: Response): Promise<Response | void> => {
  const { name } = req.body;
  const createdBy = req.userData.userId;

  try {
    const existingDepartment = await findOneQuery(Department, `SELECT * FROM department WHERE name = '${name}';`);

    if (existingDepartment) {
      return res.status(400).json({
        message: "The department has been located. Please try another department name.",
      });
    }

    const data = { name, isDeleted: 0, created_by: createdBy, created_at: new Date() };

    const department = await createQuery(Department, data);

    res.status(201).json({ message: "User registered successfully!", data: department });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const getAllDepartments = async (req: Request, res: Response): Promise<Response | void> => {
  try {
    const departments = await findAllQuery(Department, `SELECT * FROM department;`);

    res.json(departments);
  } catch (error) {
    logger.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const updateDepartment = async (req: any, res: Response): Promise<Response | void> => {
  const { id } = req.params;
  const { name } = req.body;
  const updatedBy = req.userData.userId;

  try {
    let department = await findByPkQuery(Department, id);
    if (!department) {
      return res.status(404).json({ message: "Department not found" });
    }

    const data = { name, updated_by: updatedBy, updated_at: new Date() };
    await updateQuery(department, data);

    res.json(department);
  } catch (error) {
    logger.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const deleteDepartment = async (req: Request, res: Response): Promise<Response | void> => {
  const { id } = req.params;

  try {
    // const result = await deleteDepartmentBYId(id);
    // const result = await deleteData(req.body);
    const result = await deleteDataAll(req.body);
    if (result && result.result === "error") {
      return res.status(400).json({ message: result.message });
    }
    res.json({ message: "Department deleted successfully" });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const deleteDepartmentBYId = async (deptId: number | string): Promise<any> => {
  const [results] = await sequelize.query("CALL DeleteDepartment(:deptId)", {
    replacements: { deptId },
  });
  return results;
};


export default { createDepartment, getAllDepartments, updateDepartment, deleteDepartment };
