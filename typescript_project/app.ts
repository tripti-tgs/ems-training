import express, { Application } from 'express';
import cors from 'cors';
import bodyparser from 'body-parser';
import dotenv from 'dotenv';
import logger from './src/logs/logger';
import userRoutes from './src/routes/user';
import employeeRoutes from './src/routes/employee';
import departmentRoutes from './src/routes/department';


dotenv.config();

const app = express();

app.use((req, res, next) => {
    logger.info(`Request: ${req.method} ${req.url}`);
    next();
});

app.use(express.json());
app.use(cors());
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());

app.use('/user', userRoutes);
app.use('/employee', employeeRoutes);
app.use('/department', departmentRoutes);


export default app;
