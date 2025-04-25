const nonAdminUserModel = require('../models/NonAdminUser');

exports.createUser = async (req, res) => {
  try {
    const newUser = await nonAdminUserModel.createUser(req.body);
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ message: 'Error creating user', error });
  }
};

exports.getNonAdminUsers = async (req, res) => {
  try {
    const users = await nonAdminUserModel.getAllUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching non-admin users' });
  }
};
  