const mongoose = require('mongoose');

// MongoDB connection URI
const mongoURI = 'mongodb+srv://triptisharma:HcIchy7aF813ldFG@cluster0.uq6sidp.mongodb.net/';

// Establish connection to MongoDB
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('Connected to MongoDB');
})
.catch(error => {
  console.error('Error connecting to MongoDB:', error);
});

// Export the mongoose connection for reuse
module.exports = mongoose.connection;
