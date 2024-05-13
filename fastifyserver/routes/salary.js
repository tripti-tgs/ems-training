const  salaryController  = require("../controllers/salaryController");
const authMiddleware = require("../middleware/auth");


async function salaryRoutes(fastify, options) {
  fastify.addHook("preHandler", authMiddleware);

  fastify.post(
    "/create",
    {
      schema: {
        body: {
          type: "object",
          required: ["emp_id", "salary", "date"],
          properties: {
            emp_id: { type: "string", minLength: 1 },
            salary: { type: "number" },
            date: { type: "string", format: "date" }
          },
          // errorMessage: {
          //   required: {
          //     emp_id: "Invalid employee ID",
          //     salary: "Invalid salary",
          //     date: "Invalid date"
          //   }
          // }
        }
      }
    },
    salaryController.createSalary

  );

  fastify.get("/", salaryController.getAllSalaries);

  fastify.put(
    "/:id",
    {
      schema: {
        params: {
          type: "object",
          properties: {
            id: { type: "string" }
          }
        },
        body: {
          type: "object",
          required: ["emp_id", "salary", "date"],
          properties: {
            emp_id: { type: "string", minLength: 1 },
            salary: { type: "number" },
            date: { type: "string", format: "date" }
          },
          // errorMessage: {
          //   required: {
          //     emp_id: "Invalid employee ID",
          //     salary: "Invalid salary",
          //     date: "Invalid date"
          //   }
          // }
        }
      }
    },
    salaryController.updateSalary
  );

fastify.delete("/:id", salaryController.deleteSalary);
}
module.exports = salaryRoutes;
