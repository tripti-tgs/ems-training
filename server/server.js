const app = require('./app');
const sequelize = require('./src/db/index');
const connection = require('./src/db/connection');

const PORT = process.env.PORT || 4000;

if (connection.readyState === 1) {
  console.log('Connected to MongoDB');
} else {
  console.log('Not connected to MongoDB');
}

sequelize.authenticate()
  .then(() => {
    console.log('Connected to the SQL database.');
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
