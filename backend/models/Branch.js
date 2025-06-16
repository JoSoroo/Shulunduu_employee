const mongoose = require('mongoose');

const branchSchema = new mongoose.Schema({
  number: { type: String, required: true },
  department: { type: String, required: true },
  phone: { type: String, required: true },
  location: { type: String, required: true },
});

module.exports = mongoose.model('Branch', branchSchema);
