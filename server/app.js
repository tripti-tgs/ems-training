const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

const userRoutes = require('./src/routes/user');
const employeeRoutes = require('./src/routes/employee');
const departmentRoutes = require('./src/routes/department');
const salaryRoutes = require('./src/routes/salary');

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/user', userRoutes);
app.use('/employee', employeeRoutes);
app.use('/department', departmentRoutes);
app.use('/salary', salaryRoutes);

module.exports = app;
