import User from '../models/User.js';
import Role from '../models/Role.js';
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';

export const validateUser = [
  body('email').isEmail().withMessage('Invalid email address')
    .custom(async (value) => {
      const user = await User.findOne({ email: value });
      if (user) {
        throw new Error('Email already in use');
      }
    }),
  body('status').isIn(['Active', 'Inactive']).withMessage('Invalid status'),
  body('firstName').notEmpty().withMessage('First name is required'),
  body('mobile').matches(/^[0-9]{10}$/).withMessage('Invalid mobile number'),
  body('employeeId').notEmpty().withMessage('Employee ID is required')
    .custom(async (value) => {
      const user = await User.findOne({ employeeId: value });
      if (user) {
        throw new Error('Employee ID already in use');
      }
    }),
  body('roleName').notEmpty().withMessage('Role name is required')
    .custom(async (value) => {
      const role = await Role.findOne({ name: value });
      if (!role) {
        throw new Error('Invalid role');
      }
    }),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
];

export const createUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { email, status, firstName, mobile, employeeId, roleName, password } = req.body;

    const role = await Role.findOne({ name: roleName });
    if (!role) return res.status(404).json({ message: 'Role not found' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ 
      email, 
      status, 
      firstName, 
      mobile, 
      employeeId, 
      role: role._id, 
      password: hashedPassword 
    });
    await user.save();

    res.status(201).json({ 
      message: 'User created successfully', 
      user: { 
        id: user._id, 
        email: user.email, 
        status: user.status, 
        firstName: user.firstName, 
        mobile: user.mobile, 
        employeeId: user.employeeId, 
        role: role.name 
      } 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUsers = async (req, res) => {
  try {
    const users = await User.find().populate('role', 'name');
    res.status(200).json(users.map(user => ({
      id: user._id,
      email: user.email,
      status: user.status,
      firstName: user.firstName,
      mobile: user.mobile,
      employeeId: user.employeeId,
      role: user.role.name
    })));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { id } = req.params;
    const { email, status, firstName, mobile, employeeId, roleName } = req.body;

    let updateData = {};
    if (email) updateData.email = email;
    if (status) updateData.status = status;
    if (firstName) updateData.firstName = firstName;
    if (mobile) updateData.mobile = mobile;
    if (employeeId) updateData.employeeId = employeeId;

    if (roleName) {
      const role = await Role.findOne({ name: roleName });
      if (!role) return res.status(404).json({ message: 'Role not found' });
      updateData.role = role._id;
    }

    const user = await User.findByIdAndUpdate(id, updateData, { new: true }).populate('role', 'name');

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json({
      message: 'User updated successfully',
      user: {
        id: user._id,
        email: user.email,
        status: user.status,
        firstName: user.firstName,
        mobile: user.mobile,
        employeeId: user.employeeId,
        role: user.role.name
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};