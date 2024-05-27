import express, { Application } from 'express';
import cors from 'cors';
import bodyparser from 'body-parser';
import dotenv from 'dotenv';

import userRoutes from './src/routes/user';
// import employeeRoutes from './src/routes/employee';
import departmentRoutes from './src/routes/department';
// import salaryRoutes from './src/routes/salary';

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());

app.use('/user', userRoutes);
// app.use('/employee', employeeRoutes);
app.use('/department', departmentRoutes);
// app.use('/salary', salaryRoutes);

export default app;
