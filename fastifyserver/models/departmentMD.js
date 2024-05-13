const mongoose = require('mongoose');

// Define the Department schema
const departmentSchema = new mongoose.Schema({
  name: String,
  isDeleted: Number,
  created_at: Date,
  updated_at: Date,
  deleted_at: Date,
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  updated_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  deleted_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: false });


const Department = mongoose.model('Department', departmentSchema);

module.exports = Department;
