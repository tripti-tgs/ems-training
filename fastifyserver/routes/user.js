
const userController = require("../controllers/userController");

async function userRoutes(fastify, options) {
  // Route to handle user registration
  fastify.post(
    "/register",
    {
      schema: {
        body: {
          type: "object",
          required: ["username", "email", "password"],
          properties: {
            username: { type: "string", minLength: 5 },
            email: { type: "string", format: "email" },
            password: { type: "string", minLength: 6 }
          }
        }
      }
    },
    userController.register
  );

  // Route to handle user login
  fastify.post("/login",userController.login);
}

module.exports = userRoutes;
