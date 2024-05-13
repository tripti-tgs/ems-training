const app = require('fastify')({
  logger: true
})

const sequelize = require("./db/index");
const userRoutes = require("./routes/user");
const employeeRoutes = require("./routes/employee");
const departmentRoutes = require("./routes/department");
const salaryRoutes = require("./routes/salary");
const connection = require("./db/connection");

require("dotenv").config();

app.register(require('@fastify/cors'));

app.register(userRoutes, { prefix: "/user" });
app.register(employeeRoutes, { prefix: "/employee" });
app.register(departmentRoutes, { prefix: "/department" });
app.register(salaryRoutes, { prefix: "/salary" });




const PORT = process.env.PORT || 4000;

if (connection.readyState === 1) {
  console.log("Connected to MongoDB");
} else {
  console.log("Not connected to MongoDB");
}
sequelize
  .authenticate()
  .then(() => {
    console.log("Connected to the SQLdatabase.");
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });
app.listen(PORT, (err) => {
  if (err) throw err;
  console.log(`server listening on ${PORT}`);
});
