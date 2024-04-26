const express = require('express');
const subscriberRoutes = require('./api/routes');
const consumerRoutes = require('./consumer/consumer');
const errorHandler = require('./middleware/errorHandler');
require('dotenv').config();
const app = express();
const PORT = 3000;

app.use('/api', subscriberRoutes);
app.use('/',consumerRoutes)
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
