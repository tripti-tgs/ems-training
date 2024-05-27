import QueryTypes from 'sequelize';
import sequelize from "../db/index"

const createQuery = async (modelName: any, data: any): Promise<any> => {
  return await modelName.create(data);
};

const findOneQuery = async (modelName: any, query: any): Promise<any> => {
  let response = await sequelize.query(query, {
    model: modelName
  });
  response = response.length == 0 ? "" : response[0].dataValues;
  return response;
};

const findAllQuery = async (modelName: any, query: any): Promise<any> => {
  let response = await sequelize.query(query, {
    model: modelName
  });
  return response;
};
const findByPkQuery = async (modelName: any, data: any): Promise<any> => {
  return await modelName.findByPk(data);
};

const updateQuery = async (modelName: any, data: any): Promise<any> => {
  return await modelName.update(data);
};

const deleteDepartmentBYId = async (deptId: number | string): Promise<any> => {
  const [results] = await sequelize.query("CALL DeleteDepartment(:deptId)", {
    replacements: { deptId },
  });
  return results;
};
export {
  createQuery,
  findOneQuery,
  findAllQuery,
  findByPkQuery,
  updateQuery,
  deleteDepartmentBYId
}