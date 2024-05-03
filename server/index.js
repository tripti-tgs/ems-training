const express = require('express');
const sequelize = require('./db/index');
const userRoutes = require('./routes/user');
const employeeRoutes = require('./routes/employee');
const departmentRoutes = require('./routes/department');
const salaryRoutes = require('./routes/salary');
const connection = require('./db/connection');
const cors = require('cors');

require('dotenv').config();
const bodyparser = require('body-parser')


const app = express();


app.use(bodyparser.json())
app.use(cors())




app.use('/user', userRoutes);
// app.use(express.static('http://localhost:8080/'));
app.use('/employee', employeeRoutes);



app.use('/department', departmentRoutes);
app.use('/salary', salaryRoutes);

const PORT = process.env.PORT || 4000;

if (connection.readyState === 1) {
  console.log('Connected to MongoDB');
} else {
  console.log('Not connected to MongoDB');
}
sequelize.authenticate()
  .then(() => {
    console.log('Connected to the SQLdatabase.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
