import express from 'express';
import { createRole, getRoles, updateRole, deleteRole } from '../controllers/roleController.js';
import { auth } from '../middleware/auth.js';
import { checkAccess } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.post('/roles', auth, checkAccess('/roles'), createRole);
router.get('/roles', auth, checkAccess('/roles'), getRoles);
router.put('/roles/:id', auth, checkAccess('/roles'), updateRole);
router.delete('/roles/:id', auth, checkAccess('/roles'), deleteRole);

export default router;