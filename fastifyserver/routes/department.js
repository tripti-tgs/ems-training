const departmentController = require("../controllers/departmentController");
const authMiddleware = require("../middleware/auth");

async function departmentRoutes(fastify, options) {
  fastify.addHook("preHandler", authMiddleware);

  fastify.get("/", departmentController.getAllDepartments);
  fastify.post(
    "/create",
    {
      schema: {
        body: {
          type: "object",
          required: ['name'],
          properties: {
            name: { type: "string", minLength: 2 }
          },
          // errorMessage: {
          //   required: {
          //     name: "Name is required"
          //   },
          //   properties: {
          //     name: "Name must be at least 2 characters long"
          //   }
          // }
        }
      }
    },
    departmentController.createDepartment
  );
  fastify.put(
    "/:id",
    {
      schema: {
        body: {
          type: "object",
          required: ['name'],
          properties: {
            name: { type: "string", minLength: 2 }
          },
          // errorMessage: {
          //   required: {
          //     name: "Name is required"
          //   },
          //   properties: {
          //     name: "Name must be at least 2 characters long"
          //   }
          // }
        }
      }
    },
    departmentController.updateDepartment
  );
  fastify.delete("/:id", departmentController.deleteDepartment);
}

module.exports = departmentRoutes;
