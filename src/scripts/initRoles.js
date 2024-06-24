import mongoose from 'mongoose';
import Role from '../models/Role.js';
import dotenv from 'dotenv';
dotenv.config();

const initRoles = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const defaultRoles = [
      { 
        name: 'Initiator', 
        accessLevels: new Map([
          ['/users', { read: true, write: false }],
          ['/roles', { read: true, write: false }]
        ])
      },
      { 
        name: 'Approver', 
        accessLevels: new Map([
          ['/users', { read: true, write: true }],
          ['/roles', { read: true, write: false }]
        ])
      },
      { 
        name: 'Admin', 
        accessLevels: new Map([
          ['/users', { read: true, write: true }],
          ['/roles', { read: true, write: true }]
        ])
      },
      { 
        name: 'DataManager', 
        accessLevels: new Map([
          ['/users', { read: true, write: true }],
          ['/roles', { read: true, write: false }]
        ])
      }
    ];

    for (let roleData of defaultRoles) {
      await Role.findOneAndUpdate(
        { name: roleData.name },
        { ...roleData, isCustom: false },
        { upsert: true, new: true }
      );
      console.log(`Role ${roleData.name} created or updated`);
    }

    console.log('Default roles initialized');
  } catch (error) {
    console.error('Error initializing roles:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

initRoles().then(() => {
  console.log('Role initialization process completed');
  process.exit(0);
}).catch((error) => {
  console.error('Error in role initialization process:', error);
  process.exit(1);
});