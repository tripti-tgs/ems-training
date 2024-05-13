const mongoose = require('mongoose');

const salarySchema = new mongoose.Schema({
  emp_id: mongoose.Schema.Types.ObjectId,
  salary: Number,
  date: Date,
  isDeleted: Number,
  created_at: Date,
  updated_at: Date,
  deleted_at: Date,
  created_by: mongoose.Schema.Types.ObjectId,
  updated_by: mongoose.Schema.Types.ObjectId,
  deleted_by: mongoose.Schema.Types.ObjectId
});


const Salary = mongoose.model('Salary', salarySchema);

module.exports = Salary;
