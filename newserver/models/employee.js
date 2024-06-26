const { DataTypes, Sequelize } = require("sequelize");
const sequelize = require("../db/index");
const Employee = sequelize.define('Employee', {
    employee_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    job_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    department_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    tableName: 'tbl_employees',
    timestamps: false
});

Employee.getEmployeeById = async (employeeId) => {
  const [results] = await sequelize.query("CALL GetEmployeeById(:employeeId)", {
    replacements: { employeeId: employeeId },
    type: Sequelize.QueryTypes.SELECT,
  });

  return results;
};

Employee.getAllEmployees = async (page, limit) => {
  const offset = (page - 1) * limit;

  const [results] = await sequelize.query(
    "CALL GetAllEmployees(:offset, :limit)",
    {
      replacements: { offset: offset, limit: limit },
      type: Sequelize.QueryTypes.SELECT,
    }
  );

  return results;
};

Employee.addOrUpdateEmployee = async (employee) => {
  const {
    EMPLOYEE_ID,
    FIRST_NAME,
    LAST_NAME,
    EMAIL,
    PHONE_NUMBER,
    HIRE_DATE,
    JOB_ID,
    SALARY,
    EMPLOYEE_PHOTO,
    COMMISSION_PCT,
    MANAGER_ID,
    DEPARTMENT_ID,
  } = employee;

  try {
    const results = await sequelize.query(
      "CALL AddOrUpdateEmployee(:EMPLOYEE_ID, :FIRST_NAME, :LAST_NAME, :EMAIL, :PHONE_NUMBER, :HIRE_DATE, :JOB_ID, :SALARY, :EMPLOYEE_PHOTO, :COMMISSION_PCT, :MANAGER_ID, :DEPARTMENT_ID)",
      {
        replacements: {
          EMPLOYEE_ID,
          FIRST_NAME,
          LAST_NAME,
          EMAIL,
          PHONE_NUMBER,
          HIRE_DATE,
          JOB_ID,
          SALARY,
          EMPLOYEE_PHOTO,
          COMMISSION_PCT,
          MANAGER_ID,
          DEPARTMENT_ID,
        },
        type: Sequelize.QueryTypes.INSERT,
      }
    );

    return results;
  } catch (error) {
    console.error("Error adding or updating employee:", error);
    throw error;
};
}
Employee.deleteEmployee = async (employeeId) => {
  await sequelize.query("CALL DeleteEmployee(:employeeId)", {
    replacements: { employeeId: employeeId },
    type: Sequelize.QueryTypes.DELETE,
  });
};

module.exports = { Employee };