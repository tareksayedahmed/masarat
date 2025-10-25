const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['HeadAdmin', 'BranchAdmin', 'Operator', 'Customer', 'Guest'],
    default: 'Customer',
  },
   branchId: {
    type: String,
    required: false,
  }
}, {
  timestamps: true,
});

module.exports = mongoose.model('User', UserSchema);
