import Role from '../models/Role.js';

export const checkAccess = (route) => {
  return async (req, res, next) => {
    try {
      const role = await Role.findOne({ name: req.user.role });
      if (!role) {
        return res.status(403).json({ message: 'Role not found' });
      }

      const access = role.accessLevels.get(route);
      if (!access) {
        return res.status(403).json({ message: 'Access denied' });
      }

      if (req.method === 'GET' && !access.read) {
        return res.status(403).json({ message: 'Read access denied' });
      }

      if (['POST', 'PUT', 'DELETE'].includes(req.method) && !access.write) {
        return res.status(403).json({ message: 'Write access denied' });
      }

      next();
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
};


export const isAdmin = async (req, res, next) => {
    if (req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Only Admin can perform this action' });
    }
    next();
  };