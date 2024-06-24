import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  status: { type: String, enum: ['Active', 'Inactive'], required: true },
  firstName: { type: String, required: true },
  mobile: { type: String, required: true },
  employeeId: { type: String, required: true, unique: true },
  role: { type: mongoose.Schema.Types.ObjectId, ref: 'Role', required: true },
  password: { type: String, required: true }
});

export default mongoose.model('User', userSchema);