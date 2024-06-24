import Role from '../models/Role.js';

export const createRole = async (req, res) => {
  try {
    const { name, accessLevels } = req.body;
    
    if (['Initiator', 'Approver', 'Admin', 'DataManager'].includes(name)) {
      return res.status(400).json({ message: 'Cannot create predefined roles' });
    }

    const role = new Role({ name, isCustom: true, accessLevels });
    await role.save();

    res.status(201).json(role);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getRoles = async (req, res) => {
  try {
    const roles = await Role.find();
    res.status(200).json(roles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { accessLevels } = req.body;

    const role = await Role.findById(id);

    if (!role) return res.status(404).json({ message: 'Role not found' });
    if (!role.isCustom) return res.status(400).json({ message: 'Cannot modify predefined roles' });

    role.accessLevels = accessLevels;
    await role.save();

    res.status(200).json(role);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteRole = async (req, res) => {
  try {
    const { id } = req.params;
    const role = await Role.findById(id);

    if (!role) return res.status(404).json({ message: 'Role not found' });
    if (!role.isCustom) return res.status(400).json({ message: 'Cannot delete predefined roles' });

    await Role.findByIdAndDelete(id);

    res.status(200).json({ message: 'Role deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};