const express = require('express');
const sequelize = require('./db/index');
const employeeRoutes = require('./routes/employee');
;

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

app.use('/employee', employeeRoutes);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
