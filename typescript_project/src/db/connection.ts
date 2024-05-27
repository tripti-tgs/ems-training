import mongoose from 'mongoose';

// MongoDB connection URI
const mongoURI: string = 'mongodb+srv://triptisharma:HcIchy7aF813ldFG@cluster0.uq6sidp.mongodb.net/';


// Establish connection to MongoDB
mongoose.connect(mongoURI)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch(error => {
    console.error('Error connecting to MongoDB:', error);
  });


export default mongoose.connection;