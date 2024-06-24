import express from 'express';
import { validateUser, createUser, getUsers, updateUser, deleteUser } from '../controllers/userController.js';
import { auth } from '../middleware/auth.js';
import { checkAccess, isAdmin } from '../middleware/roleMiddleware.js';
import { createRole } from '../controllers/roleController.js';

const router = express.Router();

router.post('/users', auth, checkAccess('/users'), validateUser, createUser);
router.get('/users', auth, checkAccess('/users'), getUsers);
router.put('/users/:id', auth, checkAccess('/users'), validateUser, updateUser);
router.delete('/users/:id', auth, checkAccess('/users'), deleteUser);

// New route for creating custom roles (Admin only)
router.post('/roles/custom', auth, isAdmin, createRole);

export default router;