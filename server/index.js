const express = require('express');
const sequelize = require('./db/index');
const userRoutes = require('./routes/user');
const employeeRoutes = require('./routes/employee');
const departmentRoutes = require('./routes/department');
const salaryRoutes = require('./routes/salary');

const cors = require('cors');

const bodyparser = require('body-parser')

const app = express();

app.use(bodyparser.json())
app.use(cors())


sequelize.authenticate()
  .then(() => {
    console.log('Connected to the database.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

app.use('/user', userRoutes);
app.use('/employee', employeeRoutes);



app.use('/department', departmentRoutes);
app.use('/salary', salaryRoutes);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
