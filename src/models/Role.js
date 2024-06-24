import mongoose from 'mongoose';

const roleSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true, 
    unique: true
  },
  isCustom: {
    type: Boolean,
    default: false
  },
  accessLevels: { 
    type: Map, 
    of: { 
      read: { type: Boolean, default: false },
      write: { type: Boolean, default: false }
    }
  }
});

// Add a static method to check if a role is predefined
roleSchema.statics.isPredefinedRole = function(roleName) {
  return ['Initiator', 'Approver', 'Admin', 'DataManager'].includes(roleName);
};

export default mongoose.model('Role', roleSchema);