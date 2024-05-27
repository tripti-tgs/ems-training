const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: Number,
  gender: Number,
  dob: Date,
  dept_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department'
  },
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
});


const Employee = mongoose.model('Employee', employeeSchema);

module.exports = Employee;
